# Loops de seção: MP4 H.264 + WebM VP9 sem áudio + poster (primeiro quadro), no tamanho e limite de cada loop.
# Uso: tools/hero-video/.venv/bin/python tools/loops/finalizar.py [loop...]   (pasta: qa/videos/loops, LOOPS_DIR=...)
# Entrada: out/<loop>-loop.mp4 (tools/loops/loop.py). Saída: final/<loop>.mp4, .webm, -poster.jpg.
# Cor: nenhuma mudança (as fotos base já têm o look); mestre sem perdas em YUV, não RGB, para a cor não
# escurecer na ida e volta. Tamanho: object-fit cover no centro, lanczos.
# Sem grão por enquanto: quando o grão do hero estiver aprovado, aplicar o mesmo (ver PLANO-LOOPS.md).
# Codecs iguais aos do hero (tools/hero-video/finalizar.py): o menor CRF que cabe no limite.
import os
import subprocess
import sys
import tempfile
from pathlib import Path

import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
DIR = Path(os.environ.get("LOOPS_DIR", Path(__file__).resolve().parents[2] / "qa/videos/loops"))
# (w, h), limite em bytes — PLANO-LOOPS.md "Finalização"; how-it-works = 720p na proporção 754x689
FINAL = {"weekend-before": ((720, 1008), 1.2e6), "how-it-works": ((788, 720), 2e6)}


def ff(*args):
    subprocess.run([FFMPEG, "-v", "error", "-y", *args], check=True)


def h264(crf):
    return ["-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart"]


def vp9(crf):
    return ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", str(crf + 10), "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-pix_fmt", "yuv420p"]


def codificar(mestre, destino, limite, args_de):
    """Menor CRF (melhor qualidade) que cabe no limite de tamanho."""
    for crf in range(18, 45, 2):
        ff("-i", str(mestre), "-an", *args_de(crf), str(destino))
        if destino.stat().st_size < limite:
            return crf
    raise SystemExit(f"{destino.name}: não coube em {limite / 1e6} MB")


saida = DIR / "final"
saida.mkdir(exist_ok=True)
with tempfile.TemporaryDirectory() as tmp:
    for loop in sys.argv[1:] or list(FINAL):
        (w, h), limite = FINAL[loop]
        mestre = Path(tmp) / f"{loop}.mkv"
        ff("-i", str(DIR / "out" / f"{loop}-loop.mp4"), "-an",
           "-vf", f"scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h}",
           "-c:v", "libx264", "-qp", "0", "-preset", "ultrafast", "-pix_fmt", "yuv444p", str(mestre))
        crf_mp4 = codificar(mestre, saida / f"{loop}.mp4", limite, h264)
        crf_webm = codificar(mestre, saida / f"{loop}.webm", limite, vp9)
        ff("-i", str(mestre), "-frames:v", "1", "-q:v", "3", str(saida / f"{loop}-poster.jpg"))
        print(f"{loop} {w}x{h} (limite {limite / 1e6} MB):")
        for ext, crf in (("mp4", f"crf {crf_mp4}"), ("webm", f"crf {crf_webm + 10}"), ("-poster.jpg", "")):
            f = saida / (f"{loop}.{ext}" if not ext.startswith("-") else f"{loop}{ext}")
            print(f"  {f.name}: {f.stat().st_size / 1e6:.2f} MB {crf}")
