"use client";

import { useSyncExternalStore } from "react";

// ?guide=1 na URL liga o modo guia. Lido no cliente para a página continuar estática;
// no servidor é sempre false, então sem o parâmetro nada é renderizado.
const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

const getSnapshot = () => new URLSearchParams(window.location.search).get("guide") === "1";

export function useGuideMode() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
