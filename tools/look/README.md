# tools/look — tratamento de cor das fotos do venue

Dá às fotos do venue um visual editorial comum (referência: montamont.com), sem tocar nos
originais. Três passos por foto: **normaliza** exposição e balanço de branco → **aplica a LUT**
(`montamont.cube`) com intensidade ajustável (padrão 70%) → **salva** em outra pasta.

## Instalar (uma vez)

```bash
python3 -m venv tools/look/.venv
tools/look/.venv/bin/pip install -r tools/look/requirements.txt
```

## Automático no site (`npm run look`)

Os originais ficam em `media/originais/` e `public/venue/` é **gerada**: não edite nem coloque
fotos lá à mão. `npm run look` roda sozinho antes de `npm run dev` e de `npm run build`:

- trata **só as fotos que o `content/site.ts` usa** (`foto("nome", …)` ou `"/venue/arquivo"`);
- intensidade por foto em `media/look.json` (`{"padrao": 0.7, "fotos": {"grande": 0.5}}`; 0 = sem
  tratamento). PNG e outros formatos são copiados como estão;
- cache em `public/venue/.look.json`: só refaz o que mudou (original, intensidade, LUT, scripts);
- apaga de `public/venue/` o que o site deixou de usar;
- sem o `.venv`, avisa e copia o original das fotos novas (o site não quebra; num deploy sem Python,
  as fotos já tratadas e commitadas continuam valendo).

Trocar uma foto do site = mudar o nome em `content/site.ts` e rodar `npm run look` (ou só salvar
com o dev ligado e reiniciar o dev). Commitar `public/venue/` junto.

## Usar à mão

```bash
# tratar as fotos do site (saída fora de public/, os originais não mudam)
tools/look/.venv/bin/python tools/look/apply.py public/venue/*.jpg --saida qa/look/tratadas
#   --forca 0.5          intensidade da LUT (0–1, padrão 0.7)
#   --sem-normalizar     só a LUT, sem mexer em exposição e balanço de branco
#   --sufixo -look       acrescenta ao nome do arquivo

# folha de antes/depois
tools/look/.venv/bin/python tools/look/antes_depois.py --antes public/venue \
    --depois qa/look/tratadas --saida qa/look/antes-depois.png [--legendas qa/look/legendas.json]

# regerar a LUT a partir de outras referências (fotos de referência ficam em qa/ref, fora do git)
tools/look/.venv/bin/python tools/look/build_lut.py --ref qa/ref --fonte public/venue
```

`apply.py` recusa salvar na mesma pasta do original. As fotos de referência nunca vão para o site.

## O que cada parte faz

- **Normalização** (`look.normalize`): balanço de branco pelos pixels quase neutros (corrige 60%
  da dominante, no máximo ±12% por canal) e exposição para uma mediana de luminância comum,
  limitada a −0,5 / +0,7 EV (foto noturna não vira dia) e sem estourar as luzes.
- **LUT** (`build_lut.py`, 33³, sRGB): medida comparando as referências com as fotos de fonte,
  ambas normalizadas — curva de tons por casamento de quantis de L\* (75% da diferença),
  saturação por faixa (sombras, meios, luzes; limitada a 0,6–1,1), matiz e croma dos verdes,
  e cor das sombras e das luzes (split toning, no máximo 6 unidades a/b).
  Os números medidos ficam em `montamont.json`.

A LUT atual foi medida com 10 fotos de montamont.com contra as 29 fotos de um venue real (primeiro cliente do template).
Para outro venue ela funciona como está; se as fotos forem muito diferentes (ex.: muito mais
frias), vale regerar com `--fonte` apontando para as fotos desse venue.

## Usar o .cube no Lightroom

O Lightroom não abre `.cube` direto: ele entra como **perfil**, criado no Camera Raw do Photoshop.

1. No Photoshop, abra qualquer foto no Camera Raw (Filtro › Filtro Camera Raw, ou abra um RAW).
2. No painel **Predefinições**, segure **Option** (Alt no Windows) e clique no ícone **Criar
   predefinição** — com Option ele vira **Criar perfil**.
3. Em **Configurações avançadas**, marque **Tabela de pesquisa de cores**, clique em **Carregar
   tabela** e escolha `montamont.cube`. Em **Intervalo de quantidade**, use mín. 0 e máx. 200.
4. Dê um nome (ex.: "Montamont 70") e um grupo, e clique em OK.
5. No Lightroom Classic ou no Lightroom, o perfil aparece em **Revelação › Perfil › Navegador de
   perfis**, no grupo escolhido, com um controle **Quantidade** (70 ≈ o padrão do script).

Dica: acerte **exposição e balanço de branco antes** de aplicar o perfil — a LUT foi medida em
fotos já normalizadas. No Photoshop também dá para usar direto: Camada › Nova camada de ajuste ›
**Pesquisa de cores** › Arquivo 3DLUT › `montamont.cube`, e baixar a opacidade para 70%.
