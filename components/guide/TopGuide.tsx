"use client";

import { usePathname } from "next/navigation";
import { site, type PaginaId } from "@/content/site";
import type { GuiaId } from "@/content/guide";
import { SectionGuide } from "@/components/guide/SectionGuide";
import { isOn } from "@/lib/site";

// Faixas do topo no modo guia (anúncio, header e hero), no fluxo: o header é fixo e cobriria
// as faixas. Nas páginas internas, a do hero dá lugar à faixa da página; na home, a abertura
// animada ganha a faixa dela antes da do hero.
export function TopGuide({ anuncio }: { anuncio: boolean }) {
  const path = usePathname();
  const pagina = (Object.keys(site.paginas) as PaginaId[]).find((id) => site.paginas[id].href === path);
  const topo: GuiaId[] = pagina ? [pagina] : [...(isOn("abertura") ? (["abertura"] as const) : []), "hero"];
  const ids: GuiaId[] = [...(anuncio ? (["anuncio"] as const) : []), "header", ...topo];
  return <SectionGuide id={ids} />;
}
