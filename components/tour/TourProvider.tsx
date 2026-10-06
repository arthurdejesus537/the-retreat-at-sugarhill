"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TourCard } from "@/components/tour/TourCard";
import { TOUR_CONVIDADOS, TOUR_PARAM } from "@/lib/tour";

// link que abre o card: /?tour (site.cta.href), em qualquer página
const abreTour = (a: HTMLAnchorElement) => {
  const url = new URL(a.href, location.href);
  return url.origin === location.origin && url.pathname === "/" && url.searchParams.has(TOUR_PARAM);
};

// Card "Schedule a Tour" do site inteiro (montado no layout). Um só listener de clique captura todo
// link /?tour — header, hero, menu, barra mobile, pacotes, footer — antes do next/link, que desiste
// da navegação quando o clique já foi tratado (defaultPrevented). Sem JS o link leva à home com
// ?tour, e a home abre o card ao carregar.
export function TourProvider() {
  const [aberto, setAberto] = useState(false);
  // nº de convidados do pacote que abriu o card; `vez` muda a cada abertura para reaplicar
  const [origem, setOrigem] = useState<{ convidados: number | null; vez: number }>({ convidados: null, vez: 0 });
  const retorno = useRef<HTMLElement | null>(null);

  const abrir = useCallback((de: HTMLElement | null, convidados: number | null) => {
    retorno.current = de;
    setOrigem((o) => ({ convidados, vez: o.vez + 1 }));
    setAberto(true);
  }, []);

  const fechar = useCallback(() => setAberto(false), []);

  // o foco volta ao botão que abriu (se ele ainda estiver na página: o menu mobile fecha junto)
  const saiu = useCallback(() => {
    const de = retorno.current;
    retorno.current = null;
    // espera o card desmontar e tirar o inert do site (alguns quadros no máximo)
    const tentar = (n: number) => {
      if (!de?.isConnected) return;
      if (de.closest("[inert]") && n < 20) requestAnimationFrame(() => tentar(n + 1));
      else de.focus({ preventScroll: true });
    };
    requestAnimationFrame(() => tentar(0));
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || !abreTour(a)) return;
      e.preventDefault();
      const n = parseInt(a.getAttribute(TOUR_CONVIDADOS) ?? "", 10);
      abrir(a, Number.isFinite(n) ? n : null);
    };
    // captura: roda antes do onClick do next/link
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [abrir]);

  // link direto /?tour: abre e limpa a URL (fechar não recarrega nem deixa o parâmetro)
  useEffect(() => {
    const url = new URL(location.href);
    if (!url.searchParams.has(TOUR_PARAM)) return;
    url.searchParams.delete(TOUR_PARAM);
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lido da URL só no cliente, uma vez
    abrir(null, null);
  }, [abrir]);

  return <TourCard aberto={aberto} convidados={origem.convidados} vez={origem.vez} onFechar={fechar} onSaiu={saiu} />;
}
