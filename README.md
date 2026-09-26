# SkyRise · Challenge OTIS 2026

Sistema de gestão de ocorrências de elevadores, desenvolvido pelo time **SkyRise** (FIAP · Engenharia de Software · 1º ano) para o Challenge 2026 com a OTIS.

A ferramenta registra, classifica, prioriza e despacha ocorrências (falhas técnicas, falta de energia, passageiros presos e pedidos de clientes) para os técnicos de campo, e oferece um painel de indicadores para a gestão.

## Telas

| Tela | Para quem | O que faz |
|---|---|---|
| Atendente | Central de atendimento | Abre ocorrências, busca e filtra, vê o histórico |
| Técnico | Técnico de campo | Fila por prioridade, assume ocorrências e atualiza o status |
| Gestão | Liderança | Indicadores, gráficos e alerta de elevadores reincidentes |

## Prioridade automática

| Tipo de ocorrência | Prioridade |
|---|---|
| Passageiro preso | CRÍTICA (fura fila) |
| Falha técnica | ALTA |
| Falta de energia | MÉDIA |
| Pedido de cliente | BAIXA |

## Divisão do time

| Pessoa | Integrante | GitHub | Parte | Branch |
|---|---|---|---|---|
| P1 | Pedro Zigiotto | [@DevPedroZigi](https://github.com/DevPedroZigi) | Dados, regras e deploy | `p1-dados` |
| P2 | Pedro Henrique | [@phthedevx](https://github.com/phthedevx) | Tela do atendente + slides da banca | `p2-atendente` |
| P3 | Ju | _a definir_ | Tela do técnico + navegação | `p3-tecnico` |
| P4 | Thiago Cunha | [@tcunha2004](https://github.com/tcunha2004) | Dashboard da gestão | `p4-dashboard` |
| P5 | Gabriela Donato | [@Gabidonaato](https://github.com/Gabidonaato) | Identidade visual, vídeo e entrega | `p5-visual` |

## Como trabalhamos com o Git

1. Antes de começar: `git checkout main` e `git pull`
2. Trabalhe **na sua branch**: `git checkout p2-atendente` (troque pelo nome da sua)
3. Traga o que já entrou na main: `git merge main`
4. Salve com mensagens claras: `git add .` e `git commit -m "Adiciona filtro por status na lista"`
5. Envie: `git push`
6. No GitHub, abra um **Pull Request** da sua branch para a `main`
7. Quem testa a sua parte revisa e aprova:

| Autor do PR | Quem revisa |
|---|---|
| P1 · Pedro Zigiotto | P5 · Gabriela |
| P2 · Pedro Henrique | P1 · Pedro Zigiotto |
| P3 · Ju | P2 · Pedro Henrique |
| P4 · Thiago | P3 · Ju |
| P5 · Gabriela | P4 · Thiago |

**Regras**
- Ninguém faz commit direto na `main`: ela é o que está publicado na Vercel e precisa estar sempre funcionando.
- Só tecnologias vistas até a **Fase 7** (em caso de dúvida, pergunte no grupo antes).
- Não suba senhas, chaves ou arquivos `.env`.

## Prazos

| Data | Entrega |
|---|---|
| 10/11/2026 | Sprint 2: MVP + deploy + vídeo pitch (meta do time: enviar até 08/11) |
| A definir (Teams) | Seletiva, 2ª mentoria e Banca Final |

## Links

- Deploy: _a definir_
- Vídeo Sprint 1: https://youtu.be/Gt166Ju_NXw
- Vídeo Sprint 2: _a definir_
