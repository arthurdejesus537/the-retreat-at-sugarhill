"""Aplica o visual nas fotos: normaliza exposição e balanço de branco, aplica a LUT com
intensidade ajustável e salva a versão tratada em outra pasta. Os originais nunca são tocados.

Uso:
  tools/look/.venv/bin/python tools/look/apply.py public/venue/*.jpg --saida qa/look/tratadas
  opções: --lut tools/look/montamont.cube  --forca 0.7  --sem-normalizar  --sufixo ""
"""

from __future__ import annotations

import argparse
from pathlib import Path

import look


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("fotos", nargs="+", type=Path)
    ap.add_argument("--saida", type=Path, required=True, help="pasta das versões tratadas (não pode ser a dos originais)")
    ap.add_argument("--lut", type=Path, default=Path(__file__).with_name("montamont.cube"))
    ap.add_argument("--forca", type=float, default=0.7, help="intensidade da LUT, 0–1 (padrão 0.7)")
    ap.add_argument("--sem-normalizar", action="store_true", help="pula a normalização de exposição e balanço de branco")
    ap.add_argument("--sufixo", default="", help='acrescentado ao nome do arquivo, ex.: "-look"')
    ap.add_argument("--qualidade", type=int, default=90)
    args = ap.parse_args()

    if not 0 <= args.forca <= 1:
        raise SystemExit("--forca precisa estar entre 0 e 1")
    lut = look.read_cube(args.lut)
    args.saida.mkdir(parents=True, exist_ok=True)
    saida = args.saida.resolve()

    for foto in args.fotos:
        origem = foto.resolve()
        if origem.parent == saida:
            raise SystemExit(f"{foto}: a pasta de saída é a mesma do original — escolha outra (--saida)")
        destino = saida / f"{foto.stem}{args.sufixo}.jpg"
        if destino == origem:
            raise SystemExit(f"{foto}: o destino sobrescreveria o original")
        rgb = look.load(foto)
        info = {"wb": "-", "ev": 0}
        if not args.sem_normalizar:
            rgb, info = look.normalize(rgb)
        look.save(look.apply_lut(rgb, lut, args.forca), destino, args.qualidade)
        print(f"{foto.name:40s} ev {info['ev']:+.2f}  wb {info['wb']}  → {destino.relative_to(Path.cwd()) if destino.is_relative_to(Path.cwd()) else destino}")


if __name__ == "__main__":
    main()
