# Comum aos scripts .py do hero em vídeo: pastas, plano.json e tamanhos.
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
# pasta de trabalho do cliente (fora do git); HERO_DIR troca
HERO = Path(os.environ.get("HERO_DIR", ROOT / "qa/videos/hero"))
FORMATOS = ("desktop", "mobile")
ENTRADA = {"desktop": (1280, 720), "mobile": (720, 1280)}  # imagem que vai para a animação (o Kling sai em 720p)
FINAL = {"desktop": ((1280, 720), 2.5e6), "mobile": ((720, 1280), 1.5e6)}  # VENUE-TEMPLATE §2


def plano():
    return json.loads((HERO / "plano.json").read_text())


def fonte(caminho):
    """Foto de origem: relativa à pasta do hero ou, se não estiver lá, a public/venue/ (já tratada)."""
    for base in (HERO, ROOT / "public/venue"):
        if (base / caminho).exists():
            return base / caminho
    raise SystemExit(f"foto de origem não encontrada: {caminho}")


def formato_do_argv(argv, uso):
    f = argv[1] if len(argv) > 1 else ""
    if f not in FORMATOS:
        raise SystemExit(uso)
    return f
