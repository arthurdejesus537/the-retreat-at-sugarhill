// Etapa A: completa com IA (Bria Expand, fal.ai) as bordas de um clipe marcado "ia-expand".
// Uso: node tools/hero-video/bria-expand.mjs <clipe> <desktop|mobile>
// Lê de plano.json: base, bria.{canvas_size, original_image_size, original_image_location},
// prompt e negative_prompt (opcionais). Saída: <formato>/<clipe>.jpg no tamanho de entrada da Etapa B.
import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { ENTRADA, HERO, baixar, fal, jpegDataUrl, plano } from "./comum.mjs";

const [clip, formato] = process.argv.slice(2);
if (!clip || !ENTRADA[formato]) {
  console.error("uso: bria-expand.mjs <clipe> <desktop|mobile>");
  process.exit(1);
}
const item = plano().find((p) => p.clip === clip)?.[formato];
if (item?.modo !== "ia-expand") {
  console.error(`${clip}/${formato} não é ia-expand no plano.json`);
  process.exit(1);
}

// padrão: a IA só continua o que já existe (céu, árvore, chão); nunca pessoas ou construções
const prompt = item.prompt ?? "natural continuation of the same scene, same light and colors";
const negative_prompt = item.negative_prompt ?? "people, person, building, furniture, text, watermark, new objects";
console.log("prompt:", prompt);
console.log("negative_prompt:", negative_prompt);

const res = await fal(
  "fal-ai/bria/expand",
  { image_url: jpegDataUrl(join(HERO, item.base)), ...item.bria, prompt, negative_prompt, sync_mode: false },
  clip,
  3000,
);
const url = res.image?.url;
if (!url) throw new Error(`sem imagem na resposta: ${JSON.stringify(res).slice(0, 300)}`);

const bruto = join(HERO, formato, `${clip}-expand-bruto.${url.split(".").pop().split("?")[0] || "png"}`);
writeFileSync(bruto, await baixar(url));
const [w, h] = ENTRADA[formato];
const final = join(HERO, formato, `${clip}.jpg`);
execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "92", "-z", String(h), String(w), bruto, "--out", final], { stdio: "ignore" });
console.log("bruto:", bruto);
console.log("final:", final, `${w}x${h}`);
