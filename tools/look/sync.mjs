// Gera public/venue/ a partir de media/originais/, tratando só as fotos que o site usa.
//
// - Lê content/site.ts e pega cada foto referenciada: foto("nome", …) ou "/venue/arquivo".
// - JPG: normaliza + aplica a LUT (tools/look/apply.py) com a intensidade de media/look.json.
//   Intensidade 0 = cópia do original. Outros formatos (PNG de logo etc.) são copiados como estão.
// - Cache: só refaz o que mudou (original, intensidade, LUT ou scripts); o resto fica.
// - Arquivos em public/venue/ que o site não usa mais são apagados (a pasta é gerada).
// - Sem Python/venv: avisa e copia o original das fotos que faltarem, para o site não quebrar.
// - Grava lib/fotos.json com largura × altura de cada foto e de cada poster de public/video/: o Media usa para pedir o arquivo
//   no tamanho certo quando a foto é recortada (object-fit: cover), ver lib/imagem.ts.
//
// Uso: npm run look   (roda sozinho antes de npm run dev e npm run build)

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ORIGINAIS = path.join(RAIZ, "media/originais");
const SAIDA = path.join(RAIZ, "public/venue");
const CONFIG = path.join(RAIZ, "media/look.json");
const MANIFESTO = path.join(SAIDA, ".look.json");
const LOOK = path.join(RAIZ, "tools/look");
const PY = path.join(LOOK, ".venv/bin/python");
const DIMENSOES = path.join(RAIZ, "lib/fotos.json");

const md5 = (buf) => createHash("md5").update(buf).digest("hex");
const ler = (f, padrao) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : padrao);
// largura × altura lidas do cabeçalho (JPEG: marcador SOF; PNG: IHDR), sem biblioteca
function dimensoes(arquivo) {
  const b = fs.readFileSync(arquivo);
  if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  for (let i = 2; i < b.length; ) {
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}
const aviso = (m) => console.warn(`\x1b[33m[look]\x1b[0m ${m}`);

// fotos que o site usa
const site = fs.readFileSync(path.join(RAIZ, "content/site.ts"), "utf8");
const usadas = new Set();
for (const m of site.matchAll(/\bfoto\(\s*"([^"]+)"/g)) usadas.add(`${m[1]}.jpg`);
for (const m of site.matchAll(/"\/venue\/([^"]+)"/g)) usadas.add(m[1]);

if (!fs.existsSync(ORIGINAIS)) {
  aviso(`sem ${path.relative(RAIZ, ORIGINAIS)}/ — nada a fazer`);
  process.exit(0);
}

const config = ler(CONFIG, { padrao: 0.7, fotos: {} });
const forcaDe = (arquivo) => config.fotos?.[path.parse(arquivo).name] ?? config.padrao ?? 0.7;

// assinatura do pipeline: LUT + scripts; mudou qualquer um, tudo é refeito
const pipeline = md5(
  ["montamont.cube", "look.py", "apply.py"].map((f) => fs.readFileSync(path.join(LOOK, f))).join(""),
);
const antigo = ler(MANIFESTO, {});
const novo = {};
const faltando = [];
const porForca = new Map();

fs.mkdirSync(SAIDA, { recursive: true });
for (const arquivo of [...usadas].sort()) {
  const origem = path.join(ORIGINAIS, arquivo);
  if (!fs.existsSync(origem)) {
    faltando.push(arquivo);
    continue;
  }
  const jpg = /\.jpe?g$/i.test(arquivo);
  const forca = jpg ? forcaDe(arquivo) : 0;
  const chave = md5(`${md5(fs.readFileSync(origem))}|${forca}|${forca > 0 ? pipeline : ""}`);
  novo[arquivo] = { forca, chave };
  if (antigo[arquivo]?.chave === chave && fs.existsSync(path.join(SAIDA, arquivo))) continue;
  if (forca === 0) {
    fs.copyFileSync(origem, path.join(SAIDA, arquivo));
    console.log(`[look] ${arquivo} (copiada, sem tratamento)`);
  } else {
    porForca.set(forca, [...(porForca.get(forca) ?? []), origem]);
  }
}

if (faltando.length) aviso(`o site usa fotos que não estão em media/originais: ${faltando.join(", ")}`);

// tratar (um processo por intensidade)
const temPython = fs.existsSync(PY);
for (const [forca, lista] of porForca) {
  if (!temPython) {
    aviso(`sem tools/look/.venv — ${lista.length} foto(s) copiadas SEM tratamento (ver tools/look/README.md)`);
    for (const f of lista) {
      fs.copyFileSync(f, path.join(SAIDA, path.basename(f)));
      novo[path.basename(f)].chave = "sem-tratamento";
    }
    continue;
  }
  execFileSync(PY, [path.join(LOOK, "apply.py"), ...lista, "--saida", SAIDA, "--forca", String(forca)], {
    cwd: RAIZ,
    stdio: "inherit",
  });
}

// limpar o que o site não usa mais
for (const f of fs.readdirSync(SAIDA)) {
  if (f.startsWith(".") || novo[f]) continue;
  fs.rmSync(path.join(SAIDA, f));
  console.log(`[look] ${f} removida de public/venue (o site não usa mais)`);
}

fs.writeFileSync(MANIFESTO, JSON.stringify(novo, null, 2) + "\n");
// + posters dos vídeos (public/video/**/<nome>-poster.jpg), que também passam pelo Media
const VIDEO = path.join(RAIZ, "public/video");
const posters = fs.existsSync(VIDEO)
  ? fs.readdirSync(VIDEO, { recursive: true }).filter((f) => String(f).endsWith("-poster.jpg")).map((f) => `/video/${String(f).split(path.sep).join("/")}`)
  : [];
const dims = Object.fromEntries([
  ...Object.keys(novo).sort().map((f) => [`/venue/${f}`, dimensoes(path.join(SAIDA, f))]),
  ...posters.sort().map((f) => [f, dimensoes(path.join(RAIZ, "public", f))]),
]);
const dimsTexto = JSON.stringify(dims, null, 2) + "\n";
if (!fs.existsSync(DIMENSOES) || fs.readFileSync(DIMENSOES, "utf8") !== dimsTexto) fs.writeFileSync(DIMENSOES, dimsTexto);
const tratadas = Object.values(novo).filter((v) => v.forca > 0).length;
console.log(`[look] ${Object.keys(novo).length} fotos em public/venue (${tratadas} tratadas) — ok`);
