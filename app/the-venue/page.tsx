import { notFound } from "next/navigation";
import { InternalPage } from "@/components/pages/InternalPage";
import { VenueSpaces } from "@/components/pages/VenueSpaces";
import { paginaMetadata, paginaOn } from "@/lib/site";

export const metadata = paginaMetadata("the_venue");

// Página The Venue: faixa de números + todos os espaços com a descrição completa.
export default function TheVenuePage() {
  if (!paginaOn("the_venue")) notFound();
  return (
    <InternalPage id="the_venue">
      <VenueSpaces />
    </InternalPage>
  );
}
