// Comum aos scripts .mjs do hero em vídeo: pastas, plano.json, chave e fila do fal.ai.
// A chave vem de FAL_KEY (ambiente) ou do .env.local da raiz, e nunca é impressa.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
// pasta de trabalho do cliente (fora do git); HERO_DIR troca
export const HERO = process.env.HERO_DIR ?? join(ROOT, "qa/videos/hero");
// tamanho da imagem que vai para a animação
export const ENTRADA = { desktop: [1280, 720], mobile: [720, 1280] }; // o Kling sai em 720p

export const plano = () => JSON.parse(readFileSync(join(HERO, "plano.json"), "utf8"));

function falKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  const env = join(ROOT, ".env.local");
  const m = existsSync(env) && readFileSync(env, "utf8").match(/^FAL_KEY=["']?([^"'\n]+)/m);
  if (!m) throw new Error("FAL_KEY não encontrada (ambiente ou .env.local).");
  return m[1].trim();
}

export const jpegDataUrl = (arquivo) => `data:image/jpeg;base64,${readFileSync(arquivo).toString("base64")}`;

// Enfileira no fal.ai, espera e devolve a resposta final.
export async function fal(endpoint, input, rotulo, intervalo = 4000) {
  const headers = { Authorization: `Key ${falKey()}`, "Content-Type": "application/json" };
  const sub = await fetch(`https://queue.fal.run/${endpoint}`, { method: "POST", headers, body: JSON.stringify(input) }).then((r) => r.json());
  if (!sub.request_id) throw new Error(`${rotulo}: falha ao enfileirar ${JSON.stringify(sub).slice(0, 300)}`);
  console.log(`${rotulo}: request ${sub.request_id}`);
  for (;;) {
    await new Promise((r) => setTimeout(r, intervalo));
    const st = await fetch(sub.status_url, { headers }).then((r) => r.json());
    if (st.status === "COMPLETED") break;
    if (st.status !== "IN_QUEUE" && st.status !== "IN_PROGRESS") throw new Error(`${rotulo}: status ${JSON.stringify(st).slice(0, 300)}`);
  }
  return fetch(sub.response_url, { headers }).then((r) => r.json());
}

export const baixar = async (url) => Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
