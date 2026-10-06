import { notFound } from "next/navigation";
import { InternalPage } from "@/components/pages/InternalPage";
import { PackagesDetails } from "@/components/pages/PackagesDetails";
import { paginaMetadata, paginaOn } from "@/lib/site";

export const metadata = paginaMetadata("packages");

// Página Packages: oferta, a seção Packages da home, pacotes com a lista completa, adicionais,
// não incluso e FAQ de preço.
export default function PackagesPage() {
  if (!paginaOn("packages")) notFound();
  return (
    <InternalPage id="packages">
      <PackagesDetails />
    </InternalPage>
  );
}
