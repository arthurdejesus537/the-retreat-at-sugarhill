"""Funções do pipeline de cor: conversões sRGB/Lab, normalização de exposição e balanço de
branco, leitura/escrita e aplicação de LUT 3D (.cube). Usado por build_lut.py e apply.py."""

from __future__ import annotations

import numpy as np
from PIL import Image, ImageOps

# ---------------------------------------------------------------------------
# Conversões (sRGB D65)
# ---------------------------------------------------------------------------

_M_RGB2XYZ = np.array(
    [[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]]
)
_M_XYZ2RGB = np.linalg.inv(_M_RGB2XYZ)
_WHITE = np.array([0.95047, 1.0, 1.08883])


_Y = np.array([0.2126, 0.7152, 0.0722])


def _mat3(x: np.ndarray, m: np.ndarray) -> np.ndarray:
    """x (…, 3) · mᵀ, canal a canal. Evita o `@` em arrays grandes: o BLAS desta build do
    numpy no macOS dá segfault com imagens de vários megapixels."""
    return x[..., 0:1] * m[:, 0] + x[..., 1:2] * m[:, 1] + x[..., 2:3] * m[:, 2]


def luminancia(lin: np.ndarray) -> np.ndarray:
    return lin[..., 0] * _Y[0] + lin[..., 1] * _Y[1] + lin[..., 2] * _Y[2]


def to_linear(c: np.ndarray) -> np.ndarray:
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_srgb(c: np.ndarray) -> np.ndarray:
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055)


def rgb_to_lab(rgb: np.ndarray) -> np.ndarray:
    """rgb em sRGB 0–1 (…, 3) → Lab (L 0–100)."""
    xyz = _mat3(to_linear(rgb), _M_RGB2XYZ) / _WHITE
    f = np.where(xyz > 216 / 24389, np.cbrt(xyz), (24389 / 27 * xyz + 16) / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def lab_to_rgb(lab: np.ndarray) -> np.ndarray:
    fy = (lab[..., 0] + 16) / 116
    fx = fy + lab[..., 1] / 500
    fz = fy - lab[..., 2] / 200
    f = np.stack([fx, fy, fz], -1)
    xyz = np.where(f**3 > 216 / 24389, f**3, (116 * f - 16) / (24389 / 27)) * _WHITE
    return to_srgb(_mat3(xyz, _M_XYZ2RGB))


# ---------------------------------------------------------------------------
# Imagens
# ---------------------------------------------------------------------------


def load(path, max_side: int | None = None) -> np.ndarray:
    """Abre a foto (respeitando a orientação EXIF) como float32 sRGB 0–1."""
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    if max_side:
        im.thumbnail((max_side, max_side), Image.LANCZOS)
    return np.asarray(im, dtype=np.float32) / 255


def save(arr: np.ndarray, path, quality: int = 90) -> None:
    Image.fromarray((np.clip(arr, 0, 1) * 255 + 0.5).astype(np.uint8)).save(path, quality=quality, optimize=True)


# ---------------------------------------------------------------------------
# Normalização: balanço de branco pelos pixels quase neutros + exposição com proteção de luzes
# ---------------------------------------------------------------------------

WB_FORCA = 0.6          # quanto da dominante medida é corrigida (1 = neutraliza tudo)
WB_LIMITE = 0.12        # ganho máximo por canal: ±12%
EXPO_ALVO = 0.16        # luminância linear mediana desejada (~ L* 47)
EXPO_EV = (-0.5, 0.7)   # correção máxima em EV: fotos noturnas não viram dia


def normalize(rgb: np.ndarray) -> tuple[np.ndarray, dict]:
    lin = to_linear(rgb)
    lab = rgb_to_lab(rgb)
    croma = np.hypot(lab[..., 1], lab[..., 2])
    neutros = (croma < 12) & (lab[..., 0] > 25) & (lab[..., 0] < 88)
    ganhos = np.ones(3)
    if neutros.mean() > 0.02:
        media = lin[neutros].mean(0)
        g = media.mean() / np.maximum(media, 1e-6)
        g = 1 + WB_FORCA * (g - 1)
        ganhos = np.clip(g, 1 - WB_LIMITE, 1 + WB_LIMITE)
        ganhos /= float((ganhos * _Y).sum())  # não muda a luminância
    lin = lin * ganhos

    y = luminancia(lin)
    ev = float(np.clip(np.log2(EXPO_ALVO / max(np.median(y), 1e-4)), *EXPO_EV))
    ganho = 2**ev
    p995 = float(np.percentile(y, 99.5))
    if p995 * ganho > 0.97 and ganho > 1:  # clarear sem estourar as luzes
        ganho = max(1.0, 0.97 / p995)
        ev = float(np.log2(ganho))
    return to_srgb(lin * ganho), {"wb": ganhos.round(3).tolist(), "ev": round(ev, 2)}


# ---------------------------------------------------------------------------
# LUT 3D (.cube)
# ---------------------------------------------------------------------------


def write_cube(lut: np.ndarray, path, title: str) -> None:
    """lut: (n, n, n, 3) indexada [b, g, r] — ordem do .cube: R varia mais rápido."""
    n = lut.shape[0]
    with open(path, "w") as f:
        f.write(f'TITLE "{title}"\nLUT_3D_SIZE {n}\nDOMAIN_MIN 0.0 0.0 0.0\nDOMAIN_MAX 1.0 1.0 1.0\n')
        for v in lut.reshape(-1, 3):
            f.write(f"{v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")


def read_cube(path) -> np.ndarray:
    n, dados = None, []
    for linha in open(path):
        linha = linha.strip()
        if not linha or linha.startswith("#"):
            continue
        if linha.startswith("LUT_3D_SIZE"):
            n = int(linha.split()[1])
        elif linha[0].isdigit() or linha[0] in "-.":
            dados.append([float(x) for x in linha.split()])
    if n is None:
        raise ValueError(f"{path}: sem LUT_3D_SIZE")
    return np.asarray(dados, dtype=np.float32).reshape(n, n, n, 3)


def apply_lut(rgb: np.ndarray, lut: np.ndarray, forca: float = 1.0) -> np.ndarray:
    """Interpolação trilinear; forca 0–1 mistura com a imagem de entrada."""
    n = lut.shape[0]
    p = np.clip(rgb, 0, 1) * (n - 1)
    i0 = np.floor(p).astype(np.int32)
    i0 = np.minimum(i0, n - 2)
    t = p - i0
    r0, g0, b0 = i0[..., 0], i0[..., 1], i0[..., 2]
    tr, tg, tb = t[..., 0:1], t[..., 1:2], t[..., 2:3]
    out = 0
    for db, wb in ((0, 1 - tb), (1, tb)):
        for dg, wg in ((0, 1 - tg), (1, tg)):
            for dr, wr in ((0, 1 - tr), (1, tr)):
                out = out + lut[b0 + db, g0 + dg, r0 + dr] * (wb * wg * wr)
    return rgb + forca * (out - rgb)
