# Etapa 0: recorta as fotos de origem conforme o plano.json.
# Uso: tools/hero-video/.venv/bin/python tools/hero-video/preparar.py [clipe...]
#   modo "corte":     `caixa` [x0, y0, x1, y1] da foto de origem → <formato>/<clipe>.jpg no tamanho de entrada
#   modo "ia-expand": se tiver `caixa_base`, recorta a base que vai para o bria-expand.mjs (campo `base`)
import sys

from PIL import Image

from comum import ENTRADA, FORMATOS, HERO, fonte, plano

pedidos = sys.argv[1:]
for item in plano():
    if pedidos and item["clip"] not in pedidos:
        continue
    origem = Image.open(fonte(item["fonte"])).convert("RGB")
    for f in FORMATOS:
        cfg = item[f]
        if cfg["modo"] == "corte":
            destino = HERO / f / f"{item['clip']}.jpg"
            img = origem.crop(tuple(cfg["caixa"])).resize(ENTRADA[f], Image.LANCZOS)
        elif cfg.get("caixa_base"):
            destino = HERO / cfg["base"]
            img = origem.crop(tuple(cfg["caixa_base"]))
        else:
            continue
        destino.parent.mkdir(parents=True, exist_ok=True)
        img.save(destino, quality=92)
        print(f"{item['clip']} {f}: {destino.relative_to(HERO)} {img.size[0]}x{img.size[1]}")
