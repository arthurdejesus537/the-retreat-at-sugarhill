# Prancha de frames (início, meio, fim) de cada clipe animado, para aprovação.
# Uso: tools/hero-video/.venv/bin/python tools/hero-video/prancha-frames.py <desktop|mobile> [final]
# Lê out/<formato>/ (ou final/<formato>/ com "final") e salva em review/<formato>[-final].png.
import re
import subprocess
import sys
from io import BytesIO

import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

from comum import HERO, formato_do_argv, plano

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
formato = formato_do_argv(sys.argv, "uso: prancha-frames.py <desktop|mobile> [final]")
pasta = "final" if "final" in sys.argv[2:] else "out"
clipes = [p["clip"] for p in plano()]
W, H = (480, 270) if formato == "desktop" else (240, 427)
GAP, LABEL = 12, 28
try:
    FONT = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 14)
except OSError:
    FONT = ImageFont.load_default()


def info(video):
    err = subprocess.run([FFMPEG, "-i", str(video)], capture_output=True, text=True).stderr
    d = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    dur = int(d[1]) * 3600 + int(d[2]) * 60 + float(d[3])
    res = re.search(r"Video:.*?(\d{3,5})x(\d{3,5})", err)
    return dur, f"{res[1]}x{res[2]}", "Audio:" in err


def frame(video, t):
    png = subprocess.run(
        [FFMPEG, "-v", "error", "-ss", f"{t:.2f}", "-i", str(video), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
        capture_output=True,
    ).stdout
    return Image.open(BytesIO(png)).convert("RGB")


board = Image.new("RGB", (GAP + 3 * (W + GAP), GAP + len(clipes) * (H + LABEL + GAP)), (24, 24, 24))
d = ImageDraw.Draw(board)
for i, c in enumerate(clipes):
    video = HERO / pasta / formato / f"{c}.mp4"
    dur, res, audio = info(video)
    mb = video.stat().st_size / 1e6
    print(f"{c}: {dur:.2f}s {res} {mb:.1f} MB {'com áudio' if audio else 'sem áudio'}")
    y = GAP + i * (H + LABEL + GAP)
    d.text((GAP, y + 8), f"{c}  ·  {res}  ·  {dur:.1f}s  ·  início / meio / fim", fill=(230, 230, 230), font=FONT)
    for j, t in enumerate([0, dur / 2, max(dur - 0.1, 0)]):
        board.paste(frame(video, t).resize((W, H), Image.LANCZOS), (GAP + j * (W + GAP), y + LABEL))
out = HERO / "review" / (f"{formato}-final.png" if pasta == "final" else f"{formato}.png")
out.parent.mkdir(exist_ok=True)
board.save(out)
print(out)
