# Melhorias de template — buck-creek-hall

Mudanças de sistema feitas neste cliente que devem voltar para `~/venue-default`.
Formato: data · o que mudou · commits · status (pendente/devolvido).

- 2026-10-07 · Getting Here: o bloco "Where guests stay" some quando não há texto, nem `como_chegar.proximos`, nem seção Stay ligada (mesma correção do oak-and-ivy, 34a5c3c) · `components/sections/GettingHere.tsx` · ver git log · pendente
- 2026-10-07 · Hero: campo opcional `hero.foco_mobile` (object-position da foto no celular, ex. "15% 50%"; null/ausente = centro) para tirar o assunto da foto de trás do H1 no corte vertical. No template, adicionar `foco_mobile: null as string | null` em `hero` e trocar a leitura tipada do Hero.tsx por `hero.foco_mobile` · `components/sections/Hero.tsx`, `styles/Hero.module.css` · ver git log · pendente
