"""Folha de antes/depois: pares (original · tratada) lado a lado, com legenda.

Uso:
  tools/look/.venv/bin/python tools/look/antes_depois.py --antes public/venue --depois qa/look/tratadas \\
      --saida qa/look/antes-depois.png [--legendas legendas.json] [--colunas 2]
legendas.json (opcional): {"arquivo.jpg": "seção · o que mostra"}
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ALTURA = 420
MARGEM = 16
LEGENDA = 34


def fonte(tam: int):
    for f in ("/System/Library/Fonts/Helvetica.ttc", "/System/Library/Fonts/Supplemental/Arial.ttf"):
        try:
            return ImageFont.truetype(f, tam)
        except OSError:
            pass
    return ImageFont.load_default()


def miniatura(p: Path) -> Image.Image:
    im = ImageOps.exif_transpose(Image.open(p)).convert("RGB")
    w = round(im.width * ALTURA / im.height)
    return im.resize((w, ALTURA), Image.LANCZOS)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--antes", type=Path, required=True)
    ap.add_argument("--depois", type=Path, required=True)
    ap.add_argument("--saida", type=Path, required=True)
    ap.add_argument("--legendas", type=Path)
    ap.add_argument("--colunas", type=int, default=2)
    ap.add_argument("--ordem", nargs="*", help="arquivos na ordem desejada (padrão: alfabética)")
    args = ap.parse_args()

    legendas = json.loads(args.legendas.read_text()) if args.legendas else {}
    nomes = args.ordem or sorted(p.name for p in args.depois.glob("*.jpg"))
    pares = []
    for n in nomes:
        a, d = args.antes / n, args.depois / n
        if a.exists() and d.exists():
            pares.append((n, miniatura(a), miniatura(d)))
    if not pares:
        raise SystemExit("nenhum par encontrado")

    larg_par = max(a.width + d.width for _, a, d in pares) + MARGEM
    cols = args.colunas
    linhas = -(-len(pares) // cols)
    W = cols * larg_par + MARGEM
    H = linhas * (ALTURA + LEGENDA + MARGEM) + MARGEM + 40
    folha = Image.new("RGB", (W, H), (249, 247, 245))
    dr = ImageDraw.Draw(folha)
    f, fp = fonte(18), fonte(14)
    dr.text((MARGEM, 12), "ANTES (original)  ·  DEPOIS (normalizado + LUT)", fill=(29, 29, 28), font=f)
    for i, (n, a, d) in enumerate(pares):
        x = MARGEM + (i % cols) * larg_par
        y = 40 + MARGEM + (i // cols) * (ALTURA + LEGENDA + MARGEM)
        folha.paste(a, (x, y))
        folha.paste(d, (x + a.width + 4, y))
        dr.text((x, y + ALTURA + 6), legendas.get(n, n), fill=(29, 29, 28), font=f)
        dr.text((x + a.width + 4, y + 6), "DEPOIS", fill=(255, 255, 255), font=fp)
        dr.text((x + 6, y + 6), "ANTES", fill=(255, 255, 255), font=fp)
    args.saida.parent.mkdir(parents=True, exist_ok=True)
    folha.save(args.saida, optimize=True)
    print(f"{len(pares)} pares → {args.saida} ({W}×{H})")


if __name__ == "__main__":
    main()
