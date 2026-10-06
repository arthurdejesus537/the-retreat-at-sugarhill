import { site, type Pacote } from "@/content/site";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { TOUR_CONVIDADOS } from "@/lib/tour";
import styles from "@/styles/CardPackage.module.css";

const MAX_ITENS = 6;

// Card de pacote (Packages): o card de produto do modelo sem imagem e sem carrinho.
// Nome, preço "a partir de", para quem é, até 6 incluídos + "+N more" e o botão da data.
// completo: a lista inteira, sem "+N more" (página Packages).
export function CardPackage({ pacote, completo = false }: { pacote: Pacote; completo?: boolean }) {
  const { sem_preco, mais, botao, selo } = site.secoes.pacotes;
  const visiveis = completo ? pacote.inclui : pacote.inclui.slice(0, MAX_ITENS);
  const resto = pacote.inclui.length - visiveis.length;

  return (
    <article className={styles.card} data-featured={pacote.destaque || undefined}>
      {pacote.destaque && <Badge className={styles.badge}>{selo}</Badge>}
      <Placeholder as="h3" className={`t-h3 ${styles.name}`}>{pacote.nome}</Placeholder>
      <Placeholder className={styles.price}>{pacote.preco ?? sem_preco}</Placeholder>
      {pacote.para_quem && <Placeholder className={`t-body ${styles.for}`}>{pacote.para_quem}</Placeholder>}
      {visiveis.length > 0 && (
        <ul className={styles.list}>
          {visiveis.map((item, i) => (
            <li key={`${item}-${i}`} className="t-body">
              {item}
            </li>
          ))}
          {resto > 0 && (
            <li className={`t-meta ${styles.more}`}>
              +{resto} {mais}
            </li>
          )}
        </ul>
      )}
      {/* abre o card Schedule a Tour com a faixa de convidados do pacote marcada */}
      <Button
        href={site.cta.href}
        theme="black"
        variant={pacote.destaque ? "solid" : "outline"}
        fullWidth
        className={styles.button}
        dados={pacote.convidados ? { [TOUR_CONVIDADOS]: String(pacote.convidados) } : undefined}
      >
        {botao}
      </Button>
    </article>
  );
}
