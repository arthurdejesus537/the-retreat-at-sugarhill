import type { Metadata } from "next";
import { site, type Campo, type MidiaSpec, type PaginaId, type SecaoId } from "@/content/site";

// Leitura de content/site.ts pelos componentes.

// valor de um campo do venue.json; campo ausente ou null = não aparece
export const val = <T,>(c: Campo<T> | null | undefined): T | null => c?.valor ?? null;

// texto de instrução do template ("[PLACEHOLDER] …", "[CIDADE]")
export const isPlaceholder = (text: unknown) => typeof text === "string" && text.trimStart().startsWith("[");

// rótulo do placeholder de mídia: [FOTO — cerimônia ao ar livre, horizontal, mín. 2400px]
export const midiaLabel = ({ tipo, descricao, formato, minimo }: MidiaSpec) =>
  `[${tipo === "video" ? "VÍDEO" : "FOTO"} — ${descricao}, ${formato}, mín. ${minimo}]`;

// proporção do placeholder pelo formato declarado
// poster de um loop de seção (content/site.ts, LoopSecao)
export const posterLoop = (nome: string) => `/video/loops/${nome}-poster.jpg`;

export const midiaRatio = (formato: MidiaSpec["formato"]) =>
  formato === "horizontal" ? "3 / 2" : formato === "vertical" ? "2 / 3" : "1 / 1";

// links de telefone: só dígitos (e + inicial); telefone placeholder vira "#"
const digits = (phone: string | null) => {
  if (!phone || isPlaceholder(phone)) return null;
  const d = phone.replace(/[^\d+]/g, "");
  return d.length >= 7 ? d : null;
};

// "Text us": sms: nos EUA; wa.me quando site.contato.canal = "whatsapp" (número com DDI, só dígitos)
export const smsHref = (phone: string | null) => {
  const d = digits(phone);
  if (!d) return "#";
  if (site.contato.canal === "whatsapp") {
    const texto = site.contato.mensagem ? `?text=${encodeURIComponent(site.contato.mensagem)}` : "";
    return `https://wa.me/${d.replace(/\D/g, "")}${texto}`;
  }
  return `sms:${d}`;
};

export const telHref = (phone: string | null) => {
  const d = digits(phone);
  return d ? `tel:${d}` : "#";
};

// Seção ligada = enabled e com o dado mínimo para existir (VENUE-TEMPLATE §3, "Pode desligar?").
export function isOn(id: SecaoId): boolean {
  if (!site.secoes[id].enabled) return false;
  switch (id) {
    case "anuncio":
      return val(site.oferta.valor) !== null;
    case "pacotes":
      return site.pacotes.length > 0;
    case "hospedagem":
      return site.hospedagem.length > 0;
    case "depoimentos":
      return site.depoimentos.length >= 2;
    case "espacos":
      return site.espacos.length > 0;
    case "faq":
      return site.faq.length > 0;
    case "como_chegar":
      return val(site.identidade.endereco) !== null;
    case "galeria":
      return site.galeria.fotos.length > 0;
    default:
      return true;
  }
}

// Página interna ligada = enabled e com o conteúdo do bloco central (sem espaços, pacotes ou
// hospedagens, a página não existe e os links voltam para a âncora da home).
export function paginaOn(id: PaginaId): boolean {
  if (!site.paginas[id].enabled) return false;
  switch (id) {
    case "the_venue":
      return site.espacos.length > 0;
    case "packages":
      return isOn("pacotes");
    case "stay":
      return isOn("hospedagem");
  }
}

// link da seção da home para a página completa ("See all packages →"); null = página desligada
export const paginaLink = (id: PaginaId) =>
  paginaOn(id) ? { label: site.paginas[id].link_home, href: site.paginas[id].href } : null;

// links do header/menus/footer: só os das seções ligadas; com a página ligada, vão para ela
export const navLinks = () =>
  site.secoes.header.nav
    .filter((l) => isOn(l.secao as SecaoId))
    .map(({ label, href, pagina }) => ({
      label,
      href: pagina && paginaOn(pagina as PaginaId) ? site.paginas[pagina as PaginaId].href : href,
    }));

// URL pública do site (canonical e breadcrumbs): seo.url ou identidade.site; placeholder = null
export function siteUrl(): URL | null {
  const url = site.seo.url ?? val(site.identidade.site);
  if (!url || isPlaceholder(url)) return null;
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

// SEO de cada página interna: title, description e canonical (noindex vem do layout)
export function paginaMetadata(id: PaginaId): Metadata {
  const p = site.paginas[id];
  return {
    title: `${p.seo.titulo} | ${val(site.identidade.nome)}`,
    description: p.seo.descricao,
    alternates: siteUrl() ? { canonical: p.href } : undefined,
  };
}
