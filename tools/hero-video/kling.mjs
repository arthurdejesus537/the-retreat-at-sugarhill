// Etapa B: anima cada clipe com Kling 3.0 Turbo Standard (fal.ai), 5s, uma geração por clipe.
// Uso: node tools/hero-video/kling.mjs <desktop|mobile> [clipe...]
// Sem clipes, anima todos os do plano.json. Prompt = campo `animacao` do clipe (o mesmo nos dois
// formatos). Não gera de novo o que já existe em out/<formato>/ (apague para refazer).
// O endpoint não tem campo de resolução nem de áudio: sai 720p e sem áudio.
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ENTRADA, HERO, baixar, fal, jpegDataUrl, plano } from "./comum.mjs";

const ENDPOINT = "fal-ai/kling-video/v3/turbo/standard/image-to-video";
const [formato, ...pedidos] = process.argv.slice(2);
if (!ENTRADA[formato]) {
  console.error("uso: kling.mjs <desktop|mobile> [clipe...]");
  process.exit(1);
}

const itens = plano();
const clipes = pedidos.length ? pedidos : itens.map((p) => p.clip);
const outDir = join(HERO, "out", formato);
mkdirSync(outDir, { recursive: true });

async function animar(clip) {
  const img = join(HERO, formato, `${clip}.jpg`);
  const out = join(outDir, `${clip}.mp4`);
  const prompt = itens.find((p) => p.clip === clip)?.animacao;
  if (!prompt || !existsSync(img)) throw new Error(`${clip}: sem "animacao" no plano.json ou sem ${img}`);
  if (existsSync(out)) return console.log(`${clip}: já existe, não gera de novo (${out})`);
  const res = await fal(ENDPOINT, { image_url: jpegDataUrl(img), prompt, duration: "5" }, clip, 5000);
  const url = res.video?.url;
  if (!url) throw new Error(`${clip}: sem vídeo ${JSON.stringify(res).slice(0, 300)}`);
  writeFileSync(out, await baixar(url));
  console.log(`${clip}: ${out}`);
}

const r = await Promise.allSettled(clipes.map(animar));
r.filter((x) => x.status === "rejected").forEach((x) => console.error(x.reason.message));
process.exit(r.some((x) => x.status === "rejected") ? 1 : 0);
