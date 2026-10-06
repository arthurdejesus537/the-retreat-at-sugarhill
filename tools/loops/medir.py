# Mede o deslocamento de câmera de cada quadro em relação ao primeiro: escala (zoom) e translação (px).
# Uso: tools/hero-video/.venv/bin/python tools/loops/medir.py <loop> [passo]   (lê out/<loop>-raw.mp4)
# Busca a escala que melhor alinha o quadro ao primeiro (recorte central + redimensionamento) e a translação
# por correlação de fase, em cinza e a 1/2 da resolução. Zoom > 1 = câmera foi para a frente.
import os
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
DIR = Path(os.environ.get("LOOPS_DIR", Path(__file__).resolve().parents[2] / "qa/videos/loops"))
loop, passo = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 12
raw = DIR / "out" / f"{loop}-raw.mp4"
err = subprocess.run([FFMPEG, "-i", str(raw)], capture_output=True, text=True).stderr
import re
w, h = map(int, re.search(r"Video:.*?(\d{3,5})x(\d{3,5})", err).groups())
w2, h2 = w // 2, h // 2
buf = subprocess.run([FFMPEG, "-v", "error", "-i", str(raw), "-vf", f"scale={w2}:{h2},format=gray", "-f", "rawvideo", "-"],
                     capture_output=True).stdout
q = np.frombuffer(buf, np.uint8).reshape(-1, h2, w2).astype(float)


def zoom(img, s):
    # s > 1: recorta o centro 1/s e amplia (simula ir para a frente)
    if abs(s - 1) < 1e-6:
        return img
    cw, ch = w2 / s, h2 / s
    x0, y0 = (w2 - cw) / 2, (h2 - ch) / 2
    return np.asarray(Image.fromarray(img).resize((w2, h2), Image.BICUBIC, box=(x0, y0, x0 + cw, y0 + ch)), float)


def fase(a, b):
    win = np.outer(np.hanning(h2), np.hanning(w2))
    A, B = np.fft.fft2(a * win), np.fft.fft2(b * win)
    r = np.fft.ifft2(A * B.conj() / (np.abs(A * B.conj()) + 1e-9)).real
    dy, dx = np.unravel_index(r.argmax(), r.shape)
    dy = dy - h2 if dy > h2 // 2 else dy
    dx = dx - w2 if dx > w2 // 2 else dx
    return dx * 2, dy * 2  # em px da resolução original


m = 48  # margem ignorada na comparação
base = q[0]
print(f"{loop}: {w}x{h}, {len(q)} quadros")
print(" quadro     t   zoom   dx(px)  dy(px)  erro")
for i in list(range(0, len(q), passo)) + ([len(q) - 1] if (len(q) - 1) % passo else []):
    melhor = None
    for s in np.arange(0.96, 1.30, 0.005):
        # zoom-out (s < 1) = ampliar o quadro atual em vez do primeiro
        a, b = (zoom(base.astype(np.float32), s), q[i]) if s >= 1 else (base, zoom(q[i].astype(np.float32), 1 / s))
        dx, dy = fase(a, b)
        e = np.abs(np.roll(a, (-dy // 2, -dx // 2), (0, 1))[m:-m, m:-m] - b[m:-m, m:-m]).mean()
        if melhor is None or e < melhor[0]:
            melhor = (e, s, dx, dy)
    e, s, dx, dy = melhor
    print(f"{i:6d} {i / 24:6.2f}s {s:6.3f} {dx:7d} {dy:7d} {e:6.2f}")
