# Grão dos vídeos do hero — medida no montamont.com

Referência: os dois vídeos da home do montamont.com (baixados em 2026-09-27 para
`qa/ref/montamont-video/`, fora do git, só para análise). O grão deles está gravado no arquivo.
Aplicação no nosso pipeline: `tools/hero-video/finalizar.py --grao N` (ver o README do hero-video).

## Os arquivos deles

| arquivo | tamanho | duração | codec | taxa | peso |
|---|---|---|---|---|---|
| `montamont-vorarlberg-01_v1-720p.mp4` | 720×1280 (vertical) | 18,8 s | H.264 High, 30 fps | 2,60 Mbps | **6,54 MB** (≈ 1,74 MB por 5 s) |
| `montamont-vorarlberg-02_v1-720p.mp4` | 1314×720 | 20,1 s | H.264 High, 30 fps | 2,85 Mbps | **7,63 MB** (≈ 1,90 MB por 5 s) |

Os dois vêm do Vimeo (`handler_name: Vimeo Artax`), sem WebM.

## Como foi medido

Em valores de luma de 8 bits (Y 16–235), no arquivo como é servido (já comprimido):

- **Intensidade**: desvio do resíduo depois de tirar o conteúdo (Y − média 5×5), em blocos 8×8
  lisos (variação do conteúdo < 1). Textura só soma, então vale o **piso**: percentil 20 dos
  blocos de cada faixa de brilho, com 10 trechos × 4 quadros por vídeo.
- **Temporal**: o mesmo na diferença entre quadros seguidos (÷ √2). Grão fixo daria ~0.
- **Cor**: o mesmo resíduo em U/V, comparado com Y.
- **Tamanho**: espectro do resíduo numa área lisa (céu do 01) e correlação entre pixels vizinhos.

## Resultado

Intensidade por faixa de brilho (piso espacial / temporal):

| faixa de Y | 01 (vertical) | 02 (horizontal) | nossos vídeos hoje (sem grão) |
|---|---|---|---|
| 16–45 (sombra) | 0,16 / 0,00 | 0,26 / 0,00 | 0,1–1,5 (conteúdo, não grão) |
| 45–80 | 0,59 / 0,30 | 0,95 / 0,37 | 0,4–0,5 |
| 80–120 | 0,76 / 0,54 | 1,73 / 1,01 | 0,2–0,4 |
| 120–160 | 0,89 / 0,66 | 1,90 / 1,40 | 0,2–0,4 |
| 160–200 | 0,87 / 0,62 | 2,02 / 1,66 | 0,1–0,4 |

Área lisa (céu do 01, Y ≈ 155): 0,91 espacial / 0,98 temporal.

- **Curva**: nada nas sombras, sobe até o meio-tom (~Y 90) e fica plana nos claros. Acima de Y 200 não
  há área lisa nos dois vídeos.
- **Intensidade**: o 02 tem ~2× o grão do 01. Por isso a calibração segue o formato: desktop ↔ 02
  (horizontal) e mobile ↔ 01 (vertical).
- **Tamanho**: fino. 67% da energia fica entre 0,1 e 0,3 ciclo/px (período de 3–10 px) e o vizinho
  tem correlação de 0,36–0,50. É um grão de ~2 px, não ruído de pixel.
- **Monocromático**: U/V ficam em 0,2–0,33 contra 1,5–2,3 em Y, o mesmo nível dos nossos vídeos
  sem grão. Só a luma tem grão.
- **Muda a cada quadro**: o temporal é 60–80% do espacial. Um grão fixo daria ~0.

## Reprodução (ffmpeg)

`finalizar.py --grao N`, depois da cor e antes da compressão (a cor do mestre não muda):

- ruído `noise=c0s=30:c0f=t` (novo a cada quadro) numa cópia cinza do próprio quadro, `gblur=sigma=1.2`
  (tamanho), só na luma (`blend` com `c1_expr=A:c2_expr=A`);
- peso por brilho: `clip((Y-30)/60,0,1)·clip((250-Y)/30,0,1)`, zero nas sombras e cheio de Y 90 a 220;
- média zero exata: a média e o desvio do ruído são medidos no tamanho de cada formato e descontados;
- `N` = desvio do grão nos meios-tons antes da compressão, em valores de 8 bits;
- codificação que preserva grão: MP4 com `-tune grain`; WebM sem o filtro de ruído do alt-ref
  (`-arnr-strength 0`), `-tune-content film` e `-sharpness 7`. Mesmo assim o VP9 achata o grão fino,
  então o WebM recebe `N × 2` (`GRAO_VP9`) para sair como o MP4;
- limite de tamanho com grão: desktop < 3 MB, mobile < 2 MB (`GRAO_LIMITE`).

Calibração (medida depois da compressão, no clipe 01 desktop): N 3 → meios-tons 1,70 espacial /
1,68 temporal no MP4 (CRF 22), o nível do vídeo 02. O espectro fica 0,02 / 0,22 / 0,36 / 0,24 / 0,17
contra 0,02 / 0,25 / 0,42 / 0,20 / 0,11 no Montamont (faixas de 0,1 ciclo/px).

- medido: desktop `--grao 3`, mobile `--grao 1.5`
- **aprovado no site (2026-09-27): 35% abaixo, desktop `--grao 1.95`, mobile `--grao 0.975`**. Com 3 / 1.5
  o grão ficou forte demais ao vivo, sobre os céus lisos dos nossos clipes.

## Resultado nos 4 clipes

Primeiro cliente do template, 2026-09-27 (`--grao 3` desktop, `--grao 1.5` mobile). Meios-tons depois da compressão
(MP4 / WebM), mesma medida da referência:

| clipe | desktop (alvo ≈ 1,7–2,0) | mobile (alvo ≈ 0,8–0,9) | peso desktop MP4 / WebM | peso mobile MP4 / WebM |
|---|---|---|---|---|
| 01 pavilhão | 2,03 / 2,09 | 2,09 / 2,34 (o céu já tinha 1,5 sem grão) | 2,71 / 2,72 MB | 1,44 / 1,65 MB |
| 02 casal | 2,06 / 2,72 | 0,89 / 1,19 | 2,77 / 2,92 MB | 1,55 / 1,99 MB |
| 03 recepção | 0,82 / 1,06 (CRF alto para caber) | 0,62 / 0,61 | 2,00 / 2,97 MB | 1,24 / 1,65 MB |
| 04 faíscas | 1,52 / 1,42 | 0,67 / 0,67 | 2,41 / 2,69 MB | 1,53 / 1,59 MB |

Cor: RGB médio −0,3 a −0,7 (de 255) em relação aos finais sem grão, igual em todas as faixas de brilho
(arredondamento da conversão RGB → YUV 4:4:4 do mestre, não o grão); imperceptível.
Na prancha (`qa/look/grao-comparacao.png`) o nosso grão aparece mais que o deles: lá ele cai sobre
parede e grama (textura que disfarça), aqui sobre céu liso. Se incomodar: `--grao 2` / `--grao 1`.

No ar desde 2026-09-27 (35% abaixo): desktop `--grao 1.95` → MP4 2,06–2,95 MB / WebM 1,98–2,97 MB;
mobile `--grao 0.975` → MP4 1,41–1,93 MB / WebM 1,70–1,94 MB. A tabela acima é da primeira versão (3 / 1.5).

No primeiro cliente o grão acabou retirado a pedido. A opção `--grao` continua na ferramenta, desligada por padrão.
