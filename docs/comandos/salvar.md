---
description: Protocolo de encerramento — salva tudo e atualiza o PROGRESS.md antes do /clear
---

Protocolo de encerramento de sessão. Faça, nesta ordem:

1. Confirme que todo o trabalho está commitado e com push, seguindo a regra `conteudo:` / `template:` do CLAUDE.md. Se houver algo sem commit, faça o commit agora (nunca inclua .env.local, chaves ou a pasta qa/).
2. Atualize `docs/PROGRESS.md` com três blocos curtos: **Pronto nesta sessão**, **Em andamento** e **Pendente** (inclua as pendências antes da demo e as melhorias a devolver ao template). Commit e push dessa atualização.
3. Não comece nenhuma tarefa nova.

Responda em até 3 linhas: o que foi salvo, o último commit e se é seguro dar /clear.
