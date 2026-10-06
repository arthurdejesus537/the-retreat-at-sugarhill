// Loops de seção: anima cada foto base com Kling 3.0 Turbo Standard (fal.ai), 5s, uma geração por loop.
// Uso: node tools/loops/gerar.mjs [loop...]   (pasta: qa/videos/loops, troque com LOOPS_DIR=...)
// O endpoint só aceita o primeiro quadro (sem imagem final) e segue a proporção da foto.
// Não gera de novo o que já existe em out/<loop>-raw.mp4 (apague para refazer).
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, baixar, fal, jpegDataUrl } from "../hero-video/comum.mjs";

const ENDPOINT = "fal-ai/kling-video/v3/turbo/standard/image-to-video";
const DIR = process.env.LOOPS_DIR ?? join(ROOT, "qa/videos/loops");
const PROMPTS = {
  "weekend-before":
    "The bridal party keeps holding their bouquets and arms raised in an arch over the kissing couple, bouquets sway gently, the dresses move slightly in a soft breeze, clouds drift slowly. Very subtle, natural motion, static camera. Photorealistic, same faces and outfits, no new people.",
  "how-it-works":
    "A nearly still shot of a lawn with rows of white chairs and a wooden arbor under a big tree. The camera is almost completely still: only a very tiny, barely perceptible drift up and then back down, like someone breathing while holding the camera. No zoom, no pan, no forward movement, no drone flight; the framing stays almost identical from the first to the last frame. The leaves of the big tree and the forest sway gently in the breeze, soft sunlight and shadows flicker on the grass. Photorealistic, no people, no new objects, the chairs and the arbor stay exactly the same.",
};

const pedidos = process.argv.slice(2);
const loops = pedidos.length ? pedidos : Object.keys(PROMPTS);
const outDir = join(DIR, "out");
mkdirSync(outDir, { recursive: true });

async function animar(loop) {
  const img = join(DIR, `${loop}.jpg`);
  const out = join(outDir, `${loop}-raw.mp4`);
  if (!PROMPTS[loop] || !existsSync(img)) throw new Error(`${loop}: sem prompt ou sem ${img}`);
  if (existsSync(out)) return console.log(`${loop}: já existe, não gera de novo (${out})`);
  const res = await fal(ENDPOINT, { image_url: jpegDataUrl(img), prompt: PROMPTS[loop], duration: "5" }, loop, 5000);
  const url = res.video?.url;
  if (!url) throw new Error(`${loop}: sem vídeo ${JSON.stringify(res).slice(0, 300)}`);
  writeFileSync(out, await baixar(url));
  console.log(`${loop}: ${out}`);
}

const r = await Promise.allSettled(loops.map(animar));
r.filter((x) => x.status === "rejected").forEach((x) => console.error(x.reason.message));
process.exit(r.some((x) => x.status === "rejected") ? 1 : 0);
