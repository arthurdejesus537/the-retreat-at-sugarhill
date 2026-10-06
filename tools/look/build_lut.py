"""Gera uma LUT 3D (.cube) que leva fotos normalizadas ao visual das fotos de referência.

Uso:
  tools/look/.venv/bin/python tools/look/build_lut.py --ref qa/ref --fonte public/venue \\
      --saida tools/look/montamont.cube

--ref    fotos de referência do visual (só leitura; ficam fora do git, em qa/ref)
--fonte  fotos do tipo que a LUT vai tratar (servem de "ponto de partida" na comparação)

O que a LUT faz, medido nas duas pastas (depois de normalizar exposição e balanço de branco):
  1. curva de tons: casa os quantis de luminância (L*) da fonte com os da referência
     (preto levantado, contraste de meio, teto das luzes), suavizada e misturada com a identidade
  2. saturação por faixa de tom (sombras / meios / luzes), pela razão das cromas medianas
  3. verdes: gira o matiz da folhagem e reduz a croma na direção da referência (oliva)
  4. cor das sombras e das luzes (split toning): diferença de a/b médios nas duas faixas
Tudo com limites, para a LUT não quebrar fotos fora do padrão.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

import look

EXT = {".jpg", ".jpeg", ".png", ".webp"}
MISTURA_CURVA = 0.75      # 1 = curva casada inteira; 0 = identidade
SAT_LIMITES = (0.6, 1.1)
VERDE_GIRO_MAX = 10.0     # graus
TINTA_MAX = 6.0           # unidades a/b


def fotos(pasta: Path, ignorar: tuple[str, ...] = ("logo",)) -> list[Path]:
    return sorted(p for p in pasta.iterdir() if p.suffix.lower() in EXT and not p.name.startswith(ignorar))


def amostra(pastas: list[Path]) -> np.ndarray:
    """Lab de todas as fotos (reduzidas a 512px e normalizadas), empilhado."""
    labs = []
    for p in pastas:
        rgb, _ = look.normalize(look.load(p, 512))
        labs.append(look.rgb_to_lab(rgb).reshape(-1, 3))
    return np.concatenate(labs)


def verdes(lab: np.ndarray) -> np.ndarray:
    h = np.degrees(np.arctan2(lab[:, 2], lab[:, 1])) % 360
    c = np.hypot(lab[:, 1], lab[:, 2])
    return (h > 95) & (h < 170) & (c > 8) & (lab[:, 0] > 15)


def medir(lab: np.ndarray) -> dict:
    L, a, b = lab[:, 0], lab[:, 1], lab[:, 2]
    c = np.hypot(a, b)
    faixas = {"sombras": L < 30, "meios": (L >= 30) & (L <= 70), "luzes": L > 70}
    g = verdes(lab)
    return {
        "quantis_L": np.percentile(L, np.arange(0, 101)).tolist(),
        "preto_p1": float(np.percentile(L, 1)),
        "branco_p99": float(np.percentile(L, 99)),
        "croma_mediana": {k: float(np.median(c[m])) for k, m in faixas.items()},
        "tinta_sombras": [float(a[L < 25].mean()), float(b[L < 25].mean())],
        "tinta_luzes": [float(a[L > 75].mean()), float(b[L > 75].mean())],
        "verde_matiz": float(np.degrees(np.arctan2(b[g].mean(), a[g].mean())) % 360) if g.any() else None,
        "verde_croma": float(np.median(c[g])) if g.any() else None,
        "calor_meios_b": float(b[faixas["meios"]].mean()),
    }


def construir(ref: dict, fonte: dict, n: int) -> tuple[np.ndarray, dict]:
    # 1. curva de tons: L de entrada → L da referência (casamento de quantis)
    qf, qr = np.array(fonte["quantis_L"]), np.array(ref["quantis_L"])
    qf = np.maximum.accumulate(qf + np.arange(101) * 1e-6)  # estritamente crescente
    eixo = np.linspace(0, 100, 256)
    casada = np.interp(eixo, qf, qr)
    casada = np.convolve(np.pad(casada, 8, mode="edge"), np.ones(17) / 17, mode="valid")  # suaviza
    curva = eixo + MISTURA_CURVA * (casada - eixo)
    curva = np.maximum.accumulate(curva)

    # 2. saturação por faixa
    sat = {k: float(np.clip(ref["croma_mediana"][k] / max(fonte["croma_mediana"][k], 1e-3), *SAT_LIMITES))
           for k in ("sombras", "meios", "luzes")}

    # 3. verdes
    giro, verde_sat = 0.0, 1.0
    if ref["verde_matiz"] is not None and fonte["verde_matiz"] is not None:
        giro = float(np.clip(ref["verde_matiz"] - fonte["verde_matiz"], -VERDE_GIRO_MAX, VERDE_GIRO_MAX))
        verde_sat = float(np.clip(ref["verde_croma"] / fonte["verde_croma"], 0.6, 1.0) / sat["meios"])
        verde_sat = float(np.clip(verde_sat, 0.7, 1.0))

    # 4. split toning
    def tinta(k):
        d = np.array(ref[k]) - np.array(fonte[k])
        m = np.hypot(*d)
        return (d * min(1.0, TINTA_MAX / m)).tolist() if m > 0 else [0.0, 0.0]

    t_sombra, t_luz = tinta("tinta_sombras"), tinta("tinta_luzes")

    # grade da LUT (índices [b, g, r])
    v = np.linspace(0, 1, n)
    b_, g_, r_ = np.meshgrid(v, v, v, indexing="ij")
    rgb = np.stack([r_, g_, b_], -1)
    lab = look.rgb_to_lab(rgb)
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]

    L2 = np.interp(L, eixo, curva)
    # saturação: interpolada suavemente entre as três faixas
    fs = np.interp(L, [0, 20, 50, 80, 100], [sat["sombras"], sat["sombras"], sat["meios"], sat["luzes"], sat["luzes"]])
    a2, b2 = a * fs, b * fs
    # verdes: máscara suave em torno do matiz da folhagem
    h = np.degrees(np.arctan2(b, a)) % 360
    c = np.hypot(a, b)
    peso = np.clip(1 - np.abs(h - 132) / 45, 0, 1) * np.clip((c - 4) / 10, 0, 1)
    ang = np.radians(giro * peso)
    ca, sa = np.cos(ang), np.sin(ang)
    a2, b2 = a2 * ca - b2 * sa, a2 * sa + b2 * ca
    k = 1 + (verde_sat - 1) * peso
    a2, b2 = a2 * k, b2 * k
    # split toning: sombras e luzes (máscaras suaves pela luminância de saída)
    ws = np.clip((35 - L2) / 35, 0, 1) ** 1.5
    wl = np.clip((L2 - 60) / 40, 0, 1) ** 1.5
    a2 = a2 + ws * t_sombra[0] + wl * t_luz[0]
    b2 = b2 + ws * t_sombra[1] + wl * t_luz[1]

    lut = look.lab_to_rgb(np.stack([L2, a2, b2], -1)).astype(np.float32)
    params = {
        "curva_L": {f"{x}": round(float(np.interp(x, eixo, curva)), 1) for x in (0, 10, 25, 50, 75, 90, 100)},
        "saturacao": {k: round(x, 3) for k, x in sat.items()},
        "verde_giro_graus": round(giro, 1),
        "verde_croma_extra": round(verde_sat, 3),
        "tinta_sombras_ab": [round(x, 2) for x in t_sombra],
        "tinta_luzes_ab": [round(x, 2) for x in t_luz],
    }
    return lut, params


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--ref", type=Path, required=True)
    ap.add_argument("--fonte", type=Path, required=True)
    ap.add_argument("--saida", type=Path, default=Path(__file__).with_name("montamont.cube"))
    ap.add_argument("--tamanho", type=int, default=33)
    ap.add_argument("--titulo", default="Montamont look")
    args = ap.parse_args()

    ref_fotos, fonte_fotos = fotos(args.ref), fotos(args.fonte)
    if not ref_fotos or not fonte_fotos:
        raise SystemExit("pasta de referência ou de fonte sem fotos")
    ref, fonte = medir(amostra(ref_fotos)), medir(amostra(fonte_fotos))
    lut, params = construir(ref, fonte, args.tamanho)
    look.write_cube(lut, args.saida, args.titulo)

    resumo = lambda m: {k: (round(v, 2) if isinstance(v, float) else v) for k, v in m.items() if k != "quantis_L"}  # noqa: E731
    relatorio = {"referencia": resumo(ref), "fonte": resumo(fonte), "lut": params,
                 "fotos": {"referencia": len(ref_fotos), "fonte": len(fonte_fotos)}}
    args.saida.with_suffix(".json").write_text(json.dumps(relatorio, indent=2, ensure_ascii=False))
    print(json.dumps(relatorio, indent=2, ensure_ascii=False))
    print(f"\nLUT {args.tamanho}³ salva em {args.saida}")


if __name__ == "__main__":
    main()
