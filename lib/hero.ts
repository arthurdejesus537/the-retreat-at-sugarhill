// Hero em vídeo: media query que escolhe o conjunto mobile (9:16) em vez do desktop (16:9).
// Mesmo corte do layout (celular < 768px). Usada no <source> do poster (servidor) e no
// HeroSequence (cliente), para os dois concordarem; o HeroSequence troca de conjunto se ela mudar.
export const HERO_MOBILE_QUERY = "(max-width: 767.98px)";

// HeroSequence → legenda do hero: índice do clipe que entrou na frente (CustomEvent<number>)
export const EVENTO_CLIPE = "hero:clipe";

const LENTAS = ["slow-2g", "2g", "3g"];

type Conexao = { saveData?: boolean; effectiveType?: string };

export const reduzirMovimento = () => window.matchMedia("(prefers-reduced-motion: reduce)");

// Sem vídeo no hero (fica só o poster): reduzir movimento, Save-Data ou conexão lenta. Só no cliente.
export function semVideo() {
  if (reduzirMovimento().matches) return true;
  const c = (navigator as Navigator & { connection?: Conexao }).connection;
  return Boolean(c?.saveData || (c?.effectiveType && LENTAS.includes(c.effectiveType)));
}
