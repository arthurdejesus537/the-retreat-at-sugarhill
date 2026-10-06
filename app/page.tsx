import type { Metadata } from "next";
import { isOn, siteUrl } from "@/lib/site";
import { BackgroundGrid } from "@/components/layout/BackgroundGrid";
import { JsonLd } from "@/components/layout/JsonLd";
import { FactsStrip } from "@/components/sections/FactsStrip";
import { CheckYourDate } from "@/components/sections/CheckYourDate";
import { Hero } from "@/components/sections/Hero";
import { LoveNotes } from "@/components/sections/LoveNotes";
import { Intro } from "@/components/sections/Intro";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { GettingHere } from "@/components/sections/GettingHere";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WeddingWeekend } from "@/components/sections/WeddingWeekend";
import { Packages } from "@/components/sections/Packages";
import { StayOnSite } from "@/components/sections/StayOnSite";
import { Spaces } from "@/components/sections/Spaces";

export const metadata: Metadata = {
  alternates: siteUrl() ? { canonical: "/" } : undefined,
};

// Home do venue, na ordem do docs/VENUE-TEMPLATE.md §3. Cada seção aparece só se estiver
// ligada em content/site.ts (enabled) e tiver o dado mínimo (lib/site.ts → isOn).
export default function Home() {
  return (
    <main className="stack-sections">
      <JsonLd />
      <BackgroundGrid />
      {/* no original, hero + manifesto são um único módulo que encosta no próximo; a faixa de números entra entre os dois */}
      <div className="flush-after">
        <Hero />
        {isOn("fatos") && <FactsStrip />}
        {isOn("historia") && <Intro />}
      </div>
      {isOn("espacos") && <Spaces />}
      {isOn("fim_de_semana") && <WeddingWeekend />}
      {isOn("pacotes") && <Packages />}
      {isOn("hospedagem") && <StayOnSite />}
      {isOn("depoimentos") && <LoveNotes />}
      {isOn("processo") && <HowItWorks />}
      {isOn("faq") && <Faq />}
      {isOn("como_chegar") && <GettingHere />}
      {isOn("galeria") && <Gallery />}
      {isOn("checar_data") && <CheckYourDate />}
    </main>
  );
}
