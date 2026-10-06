# Etapa C do hero em vídeo: cor, MP4 H.264 + WebM VP9 sem áudio, poster e limites de tamanho.
# Uso: tools/hero-video/.venv/bin/python tools/hero-video/finalizar.py <desktop|mobile> [--grao N] [clipe...]
# Entrada: out/<formato>/<clipe>.mp4. Saída: final/<formato>/ (<clipe>.mp4, .webm, -poster.jpg).
# Tamanho e limite de cada formato: VENUE-TEMPLATE §2 (desktop 1280x720 < 2,5 MB, mobile 720x1280 < 1,5 MB).
#
# Grão (`--grao N`): soma um grão de filme ao mestre já com a cor pronta, sem mudar a cor (média zero),
# e salva em final-grao/<formato>/ com limite GRAO_LIMITE. Medido nos vídeos do montamont.com
# (tools/look/grao-video.md): só na luma, novo a cada quadro, grão de 2–4 px (gblur 1.2),
# zero nas sombras e cheio a partir do meio-tom. N = desvio do grão em valores de 8 bits (luma) nos
# meios-tons, antes da compressão. Medido: desktop 3 (≈ vídeo 02 deles), mobile 1.5 (≈ vídeo 01); aprovado
# no site 35% abaixo (visível demais em céu liso): desktop 1.95, mobile 0.975.
# O poster sai do mestre com grão do MP4.
#
# Cor: só os clipes com `"aplicar_look": true` no plano.json (foto de origem SEM tratamento) recebem
# o look de tools/look/ (normalização + LUT a 70%, igual ao `npm run look`). Fotos de public/venue/
# já estão tratadas: aplicar de novo daria cor dobrada. A normalização é medida no primeiro frame e
# repetida igual em todos os frames, para a cor não oscilar ao longo do clipe.
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import imageio_ffmpeg
import numpy as np

from comum import FINAL, HERO, ROOT, formato_do_argv, plano

sys.path.insert(0, str(ROOT / "tools/look"))
import look  # noqa: E402

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
FORCA = 0.7
GRAO_LIMITE = {"desktop": 3e6, "mobile": 2e6}
GRAO_SIGMA = 1.2  # tamanho do grão (gblur): espectro igual ao do Montamont depois da compressão
GRAO_RUIDO = f"lutyuv=y=128:u=128:v=128,noise=c0s=30:c0f=t,gblur=sigma={GRAO_SIGMA}:planes=1"
GRAO_VP9 = 2.0  # o VP9 achata grão fino: o WebM recebe 2x para sair igual ao MP4 (medido)


def fps(video):
    err = subprocess.run([FFMPEG, "-i", str(video)], capture_output=True, text=True).stderr
    return re.search(r"([\d.]+) fps", err)[1]


def frames(video, w, h):
    p = subprocess.Popen(
        [FFMPEG, "-v", "error", "-i", str(video), "-vf", f"scale={w}:{h}:flags=lanczos", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        stdout=subprocess.PIPE,
    )
    n = w * h * 3
    while (buf := p.stdout.read(n)) and len(buf) == n:
        yield np.frombuffer(buf, np.uint8).reshape(h, w, 3)
    p.wait()


def graduar(video, mestre, w, h, taxa, com_look):
    """Gera um mestre sem perdas (RGB) já no tamanho final, com ou sem o look."""
    lut = look.read_cube(ROOT / "tools/look/montamont.cube")
    enc = subprocess.Popen(
        [FFMPEG, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", taxa, "-i", "-",
         "-c:v", "libx264rgb", "-qp", "0", "-preset", "ultrafast", str(mestre)],
        stdin=subprocess.PIPE,
    )
    ganho = None
    for f in frames(video, w, h):
        rgb = f.astype(np.float32) / 255
        if com_look:
            if ganho is None:
                _, info = look.normalize(rgb)
                ganho = np.asarray(info["wb"], np.float32) * 2 ** info["ev"]
                print(f"  look: ev {info['ev']:+.2f} wb {[round(x, 3) for x in info['wb']]} lut {FORCA:.0%}")
            rgb = look.apply_lut(look.to_srgb(look.to_linear(rgb) * ganho).astype(np.float32), lut, FORCA)
        enc.stdin.write((np.clip(rgb, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes())
    enc.stdin.close()
    enc.wait()


def ruido(w, h):
    """Média e desvio reais do ruído na luma (yuv444p) neste tamanho, para o grão ter média zero exata."""
    raw = subprocess.run(
        [FFMPEG, "-v", "error", "-f", "lavfi", "-i", f"color=c=gray:s={w}x{h}:r=24,format=yuv444p,{GRAO_RUIDO}",
         "-frames:v", "24", "-f", "rawvideo", "-pix_fmt", "yuv444p", "-"],
        capture_output=True, check=True,
    ).stdout
    y = np.frombuffer(raw, np.uint8).reshape(-1, 3, h, w)[:, 0].astype(np.float32)
    return float(y.mean()), float(y.std())


def granular(mestre, destino, n, w, h):
    """Soma o grão na luma do mestre (sem perdas, yuv444p); U e V ficam iguais. Peso 0 abaixo de Y 30,
    cheio de 90 a 220 (Y 16–235). O ruído nasce de uma cópia cinza do próprio quadro (split): um grão
    novo por quadro, sem depender de alinhar o tempo de duas entradas."""
    media, desvio = ruido(w, h)
    peso = "clip((A-30)/60,0,1)*clip((250-A)/30,0,1)"
    subprocess.run(
        [FFMPEG, "-v", "error", "-y", "-i", str(mestre), "-filter_complex",
         f"[0:v]format=yuv444p,split[a][c];[c]{GRAO_RUIDO}[g];"
         f"[a][g]blend=c0_expr='A+(B-{media:.4f})*{n / desvio:.5f}*{peso}':c1_expr=A:c2_expr=A",
         "-c:v", "libx264", "-qp", "0", "-preset", "ultrafast", "-pix_fmt", "yuv444p", str(destino)],
        check=True,
    )


def codificar(mestre, destino, limite, args_de):
    """Menor CRF (melhor qualidade) que cabe no limite de tamanho."""
    for crf in range(20, 45, 2):
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(mestre), "-an", *args_de(crf), str(destino)], check=True)
        if destino.stat().st_size < limite:
            return crf
    raise SystemExit(f"{destino.name}: não coube em {limite / 1e6} MB")


def h264(crf):
    grao_ = ["-tune", "grain"] if grao else []
    return ["-c:v", "libx264", "-preset", "slow", "-crf", str(crf), *grao_, "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart"]


def vp9(crf):
    # com grão: sem o filtro de ruído do alt-ref e com menos deblocking, senão o VP9 apaga o grão
    grao_ = ["-arnr-strength", "0", "-tune-content", "film", "-sharpness", "7"] if grao else []
    return ["-c:v", "libvpx-vp9", "-b:v", "0", "-crf", str(crf + 10), *grao_, "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-pix_fmt", "yuv420p"]


uso = "uso: finalizar.py <desktop|mobile> [--grao N] [clipe...]"
formato = formato_do_argv(sys.argv, uso)
(w, h), limite = FINAL[formato]
resto = sys.argv[2:]
grao = None
if "--grao" in resto:
    i = resto.index("--grao")
    grao = float(resto[i + 1])
    del resto[i:i + 2]
    limite = GRAO_LIMITE[formato]
itens = {p["clip"]: p for p in plano()}
clipes = resto or list(itens)
saida = HERO / ("final-grao" if grao else "final") / formato
saida.mkdir(parents=True, exist_ok=True)

with tempfile.TemporaryDirectory() as tmp:
    for c in clipes:
        video = HERO / "out" / formato / f"{c}.mp4"
        print(f"{c}:")
        mestre = Path(tmp) / f"{c}.mkv"
        graduar(video, mestre, w, h, fps(video), itens[c].get("aplicar_look", False))
        mestre_webm = mestre
        if grao:
            granular(mestre, Path(tmp) / f"{c}.grao.mkv", grao, w, h)
            granular(mestre, Path(tmp) / f"{c}.grao-vp9.mkv", grao * GRAO_VP9, w, h)
            mestre, mestre_webm = Path(tmp) / f"{c}.grao.mkv", Path(tmp) / f"{c}.grao-vp9.mkv"
            print(f"  grão {grao} (webm {grao * GRAO_VP9})")
        crf_mp4 = codificar(mestre, saida / f"{c}.mp4", limite, h264)
        crf_webm = codificar(mestre_webm, saida / f"{c}.webm", limite, vp9)
        subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(mestre), "-frames:v", "1", "-q:v", "3", str(saida / f"{c}-poster.jpg")], check=True)
        for ext, crf in (("mp4", crf_mp4), ("webm", crf_webm)):
            print(f"  {ext}: {(saida / f'{c}.{ext}').stat().st_size / 1e6:.2f} MB (crf {crf})")
