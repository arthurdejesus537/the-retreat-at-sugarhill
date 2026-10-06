# tools/hero-video — clipes do hero em vídeo

Gera os clipes do hero em sequência (VENUE-TEMPLATE §2) a partir de **fotos reais do venue**:
recorta ou completa com IA a moldura de cada formato, anima 5s e finaliza nos tamanhos do site.

Saída: 4 clipes de 5s, sem áudio, cada um em **MP4 + WebM + poster JPG**:
desktop 1280x720 < 2,5 MB · mobile 720x1280 < 1,5 MB.

## Instalar (uma vez)

```bash
python3 -m venv tools/hero-video/.venv
tools/hero-video/.venv/bin/pip install -r tools/hero-video/requirements.txt
```

Chave do [fal.ai](https://fal.ai) em `.env.local` na raiz (fora do git) ou no ambiente:

```
FAL_KEY=...
```

Nenhum script tem chave no código nem a imprime. `finalizar.py` usa o look de `tools/look/`
(`montamont.cube`). `bria-expand.mjs` usa o `sips` do macOS para redimensionar.

## Pasta de trabalho

Tudo acontece em `qa/videos/hero/` (fora do git; troque com `HERO_DIR=...`):

```
qa/videos/hero/
├── plano.json          ← o plano do cliente (copie de tools/hero-video/plano.exemplo.json)
├── src/                ← fotos de origem sem tratamento (as de public/venue/ podem ser citadas direto)
├── desktop/ mobile/    ← imagens de entrada da animação (1280x720 / 720x1280)
├── out/<formato>/      ← vídeos brutos da IA
├── final/<formato>/    ← mp4 + webm + poster, prontos para o site
└── review/             ← pranchas para aprovação
```

`plano.json`: um item por clipe, na ordem de exibição.

| campo | o quê |
|---|---|
| `clip` | nome do arquivo (`01-…` a `04-…`); vira o `nome` em `hero.videos` |
| `fonte` | foto de origem, relativa à pasta de trabalho ou a `public/venue/` |
| `animacao` | prompt do Kling (igual nos dois formatos): o que se mexe, câmera, "no new people/objects" |
| `aplicar_look` | `true` só se a foto de origem **não** tiver tratamento (as de `public/venue/` já têm) |
| `desktop` / `mobile` | `{"modo": "corte", "caixa": [x0, y0, x1, y1]}` ou `{"modo": "ia-expand", "base", "caixa_base"?, "bria": {canvas_size, original_image_size, original_image_location}, "prompt"?, "negative_prompt"?}` |

Regra da IA: só estende áreas neutras (céu, copa de árvore, chão). Nunca pessoas, construções,
mesas ou decoração. Prefira `corte`; `ia-expand` só quando a foto não cabe na proporção.

## Passo a passo (cliente novo)

```bash
PY=tools/hero-video/.venv/bin/python

$PY  tools/hero-video/preparar.py                      # 0. recortes e bases do plano.json
node tools/hero-video/bria-expand.mjs <clipe> mobile    # A. só nos "ia-expand" (um por vez)
$PY  tools/hero-video/prancha-expand.py mobile          #    aprovar review/expand-mobile.png
node tools/hero-video/kling.mjs desktop                 # B. anima (~US$ 0,56 por clipe)
node tools/hero-video/kling.mjs mobile
$PY  tools/hero-video/prancha-frames.py desktop         #    aprovar review/desktop.png (início/meio/fim)
$PY  tools/hero-video/finalizar.py desktop              # C. cor + mp4/webm/poster no limite de tamanho
$PY  tools/hero-video/finalizar.py mobile
$PY  tools/hero-video/prancha-frames.py desktop final   #    conferir o final
```

`kling.mjs` não gera de novo o que já existe em `out/` (apague o arquivo para refazer um clipe
reprovado). `finalizar.py` escolhe a melhor qualidade que cabe no limite de cada formato.

Grão de filme (opcional, medido no montamont.com, ver `tools/look/grao-video.md`): a mesma etapa C
com `--grao N` soma o grão depois da cor, sem mudá-la, e salva em `final-grao/` (limite desktop
< 3 MB, mobile < 2 MB). Não mexe em `final/`.

```bash
$PY  tools/hero-video/finalizar.py desktop --grao 1.95  # C'. com grão (35% abaixo do vídeo 02 do Montamont)
$PY  tools/hero-video/finalizar.py mobile --grao 0.975  #     (35% abaixo do vídeo 01)
```

## Levar para o site

```bash
mkdir -p public/video/hero/desktop public/video/hero/mobile
cp qa/videos/hero/final/desktop/* public/video/hero/desktop/
cp qa/videos/hero/final/mobile/*  public/video/hero/mobile/
```

Em `content/site.ts`, `hero.videos` na ordem (`alt` do 1º clipe = descrição do poster, a imagem
principal da página):

```ts
videos: [
  { nome: "01-cerimonia-entardecer", alt: "…", fonte: "qa/videos/hero (aprovado AAAA-MM-DD)" },
  …
] as ClipeHero[],
```

Depois: screenshots 1440/375, contraste do texto sobre cada clipe (≥ 4.5:1) e Lighthouse mobile.
