# Loops de seção: fecha o loop sem emenda, corta o áudio e monta a prancha de revisão.
# Uso: tools/hero-video/.venv/bin/python tools/loops/loop.py   (pasta: qa/videos/loops, troque com LOOPS_DIR=...)
# weekend-before (pessoas): bumerangue, para frente + reverso sem repetir os quadros das pontas.
# how-it-works: também bumerangue (câmera quase parada, sobe e desce); o crossfade de 1s continua disponível.
# Saída: out/<loop>-loop.mp4 (sem grão, sem tratamento), out/<loop>-recomeco-lento.mp4 (fim + começo a 1/4
# da velocidade) e review.png (início, meio, virada, fim e o quadro de recomeço, com a diferença fim→recomeço).
import os
import re
import subprocess
from io import BytesIO
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
DIR = Path(os.environ.get("LOOPS_DIR", Path(__file__).resolve().parents[2] / "qa/videos/loops"))
OUT = DIR / "out"
MODO = {"weekend-before": "bumerangue", "how-it-works": "bumerangue"}
XF = 1.0  # duração do crossfade (s)
# só o trecho inicial do bruto (s), quando a câmera anda para a frente (medir com tools/loops/medir.py)
CORTE = {"how-it-works": 2.0}
ENC = ["-an", "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]


def ff(*args):
    subprocess.run([FFMPEG, "-v", "error", "-y", *args], check=True)


def info(video):
    err = subprocess.run([FFMPEG, "-i", str(video)], capture_output=True, text=True).stderr
    d = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    n = int(subprocess.run([FFMPEG, "-i", str(video), "-map", "0:v", "-f", "null", "-"], capture_output=True, text=True)
            .stderr.rsplit("frame=", 1)[1].split()[0])
    res = re.search(r"Video:.*?(\d{3,5})x(\d{3,5})", err)
    return int(d[1]) * 3600 + int(d[2]) * 60 + float(d[3]), n, (int(res[1]), int(res[2])), "Audio:" in err


def quadro(video, n):
    png = subprocess.run([FFMPEG, "-v", "error", "-i", str(video), "-vf", f"select=eq(n\\,{n})", "-frames:v", "1",
                          "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    return Image.open(BytesIO(png)).convert("RGB")


def fechar(loop):
    raw, dst = OUT / f"{loop}-raw.mp4", OUT / f"{loop}-loop.mp4"
    dur, n, _, _ = info(raw)
    corte = ""
    if loop in CORTE:
        n = round(CORTE[loop] * 24) + 1
        dur = n / 24
        corte = f"trim=end_frame={n},setpts=PTS-STARTPTS,"
    if MODO[loop] == "bumerangue":
        # ida: 0..n-1; volta: n-2..1 (a ponta final e a inicial não se repetem)
        vf = (f"[0:v]{corte}split[a][b];[b]reverse,trim=start_frame=1:end_frame={n - 1},setpts=PTS-STARTPTS[r];"
              "[a][r]concat=n=2:v=1[v]")
        ff("-i", str(raw), "-filter_complex", vf, "-map", "[v]", *ENC, str(dst))
        virada = n - 1
    else:
        # corpo = [XF, fim]; os últimos XF s do corpo se fundem com [0, XF]; termina onde o corpo começa
        vf = (f"[0:v]split[a][b];[a]trim=start={XF},setpts=PTS-STARTPTS,fps=24[corpo];"
              f"[b]trim=end={XF},setpts=PTS-STARTPTS,fps=24[cabeca];"
              f"[corpo][cabeca]xfade=transition=fade:duration={XF}:offset={dur - 2 * XF:.3f}[v]")
        ff("-i", str(raw), "-filter_complex", vf, "-map", "[v]", *ENC, str(dst))
        virada = None
    ldur, ln, res, audio = info(dst)
    if virada is None:
        virada = ln - round(XF * 24 / 2)  # meio do crossfade
    # recomeço em câmera lenta: último 1s + primeiro 1s, 4x mais lento
    lento = OUT / f"{loop}-recomeco-lento.mp4"
    vf = (f"[0:v]split[a][b];[a]trim=start={ldur - 1:.3f},setpts=PTS-STARTPTS[f];[b]trim=end=1,setpts=PTS-STARTPTS[c];"
          "[f][c]concat=n=2:v=1,setpts=4*PTS[v]")
    ff("-i", str(dst), "-filter_complex", vf, "-map", "[v]", *ENC, str(lento))
    return dst, ldur, ln, res, audio, virada


def mae(a, b):
    return float(np.abs(np.asarray(a, float) - np.asarray(b, float)).mean())


W, GAP, LABEL, SUB = 260, 12, 30, 22
try:
    FONT = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 15)
    SMALL = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 12)
except OSError:
    FONT = SMALL = ImageFont.load_default()

linhas = []
for loop in MODO:
    dst, dur, n, res, audio, virada = fechar(loop)
    q = {k: quadro(dst, i) for k, i in
         {"início (q0)": 0, "meio": n // 2, "virada": virada, f"fim (q{n - 1})": n - 1, "recomeço (q0)": 0}.items()}
    passos = [mae(quadro(dst, i), quadro(dst, i + 1)) for i in (n // 4, n // 2, 3 * n // 4)]
    salto = mae(q[f"fim (q{n - 1})"], q["recomeço (q0)"])
    rotulo = (f"{loop}  ·  {MODO[loop]}  ·  {res[0]}x{res[1]}  ·  {dur:.2f}s / {n} quadros  ·  "
              f"{'COM áudio' if audio else 'sem áudio'}  ·  salto fim→recomeço {salto:.2f} "
              f"(passo normal {np.mean(passos):.2f})")
    print(rotulo)
    linhas.append((rotulo, q, res))

H = max(round(W * r[1] / r[0]) for _, _, r in linhas)
board = Image.new("RGB", (GAP + 5 * (W + GAP), GAP + len(linhas) * (LABEL + H + SUB + GAP)), (24, 24, 24))
d = ImageDraw.Draw(board)
for i, (rotulo, q, res) in enumerate(linhas):
    y = GAP + i * (LABEL + H + SUB + GAP)
    d.text((GAP, y + 8), rotulo, fill=(235, 235, 235), font=FONT)
    h = round(W * res[1] / res[0])
    for j, (nome, img) in enumerate(q.items()):
        x = GAP + j * (W + GAP)
        board.paste(img.resize((W, h), Image.LANCZOS), (x, y + LABEL))
        d.text((x, y + LABEL + h + 4), nome, fill=(180, 180, 180), font=SMALL)
board.save(DIR / "review.png")
print(DIR / "review.png")
