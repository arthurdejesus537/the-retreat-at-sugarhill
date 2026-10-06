import type { ElementType } from "react";
import { isPlaceholder } from "@/lib/site";

// Texto de content/site.ts. Quando ainda é placeholder de instrução ("[...]"), sai com
// data-placeholder, mas no mesmo estilo tipográfico do texto final (a classe vem de fora),
// para a página manter as proporções reais.
export function Placeholder({
  as: Tag = "p",
  className,
  children,
  id,
  entra,
}: {
  as?: ElementType;
  className?: string;
  children: string;
  id?: string;
  // entrada na abertura animada (lib/abertura.ts)
  entra?: "linha" | "bloco";
}) {
  return (
    <Tag id={id} className={className} data-placeholder={isPlaceholder(children) || undefined} data-entra={entra}>
      {children}
    </Tag>
  );
}
