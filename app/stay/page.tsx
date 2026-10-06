import { notFound } from "next/navigation";
import { InternalPage } from "@/components/pages/InternalPage";
import { GettingHere } from "@/components/sections/GettingHere";
import { StayOnSite } from "@/components/sections/StayOnSite";
import { WeddingWeekend } from "@/components/sections/WeddingWeekend";
import { site } from "@/content/site";
import { isOn, paginaLink, paginaMetadata, paginaOn } from "@/lib/site";

export const metadata = paginaMetadata("stay");

// Página Stay: todas as hospedagens + linha do tempo do fim de semana + Getting Here.
export default function StayPage() {
  if (!paginaOn("stay")) notFound();
  // o card final do fim de semana leva aos pacotes: à página, se existir; senão, à home
  const pacotes = paginaLink("packages")?.href ?? `/${site.secoes.fim_de_semana.final.href}`;
  return (
    <InternalPage id="stay">
      <StayOnSite completo />
      {isOn("fim_de_semana") && <WeddingWeekend finalHref={pacotes} />}
      {isOn("como_chegar") && <GettingHere linkHospedagem={false} />}
    </InternalPage>
  );
}
