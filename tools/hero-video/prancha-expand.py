# Prancha dos expands (Etapa A) de um formato, com a linha da foto original, para aprovação.
# Uso: tools/hero-video/.venv/bin/python tools/hero-video/prancha-expand.py <desktop|mobile>
# Saída: review/expand-<formato>.png
import sys

from PIL import Image, ImageDraw

from comum import HERO, formato_do_argv, plano

formato = formato_do_argv(sys.argv, "uso: prancha-expand.py <desktop|mobile>")
itens = [p for p in plano() if p[formato]["modo"] == "ia-expand"]
if not itens:
    raise SystemExit(f"nenhum clipe ia-expand em {formato}")
W, H = (1280, 720) if formato == "desktop" else (720, 1280)
GAP, TOP = 24, 48
board = Image.new("RGB", (GAP + len(itens) * (W + GAP), H + TOP + GAP), (24, 24, 24))
d = ImageDraw.Draw(board)
for i, p in enumerate(itens):
    img = Image.open(HERO / formato / f"{p['clip']}.jpg").convert("RGB").resize((W, H), Image.LANCZOS)
    bria = p[formato]["bria"]
    s = W / bria["canvas_size"][0]
    x0, y0 = [v * s for v in bria["original_image_location"]]
    w0, h0 = [v * s for v in bria["original_image_size"]]
    ImageDraw.Draw(img).rectangle([x0, y0, x0 + w0, y0 + h0], outline=(255, 210, 0), width=2)
    x = GAP + i * (W + GAP)
    board.paste(img, (x, TOP))
    d.text((x, 16), f"{p['clip']}  (amarelo = foto original, fora = IA)", fill=(230, 230, 230))
out = HERO / "review" / f"expand-{formato}.png"
out.parent.mkdir(exist_ok=True)
board.save(out)
print(out)
