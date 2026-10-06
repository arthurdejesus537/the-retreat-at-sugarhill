import dimensoes from "./fotos.json";

// Qualidade das fotos otimizadas pelo next/image (AVIF/WebP). O padrão 75 borrava textura e
// sombras das fotos do venue; 90 fica perto do original (+30–70% de peso). Precisa estar em
// images.qualities do next.config.ts.
export const QUALIDADE = 90;

const DIMS: Record<string, number[] | null> = dimensoes;

// `sizes` para foto com object-fit: cover. O `sizes` diz ao navegador só a LARGURA do quadro;
// quando a foto é mais larga que o quadro (foto horizontal num card vertical), o recorte usa
// só o meio dela e o arquivo escolhido pela largura sai pequeno demais (esticado 2x).
// `quadros` = proporção do quadro (largura / altura) para cada entrada de `sizes`, na mesma ordem;
// cada largura é multiplicada por (proporção da foto / proporção do quadro) quando passa de 1.
// Sem dimensões da foto (placeholder, foto fora de lib/fotos.json) o `sizes` fica como veio.
export function sizesCobrindo(src: string | null, sizes: string, quadros?: number | readonly number[]) {
  const d = src ? DIMS[src] : null;
  if (!d || quadros === undefined) return sizes;
  const foto = d[0] / d[1];
  const lista: readonly number[] = typeof quadros === "number" ? [quadros] : quadros;
  return sizes
    .split(",")
    .map((entrada, i) => {
      const k = Math.max(1, foto / (lista[Math.min(i, lista.length - 1)] ?? foto));
      return entrada.trim().replace(/([\d.]+)(vw|px)$/, (_, n, u) => `${Math.round(Number(n) * k)}${u}`);
    })
    .join(", ");
}
