# SkyRise · Challenge OTIS 2026

**Site no ar:** https://skyrise-otis.vercel.app

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

## Tecnologias

Só o que vimos até a Fase 7 (mesma base do projeto ReaproveitaAi):

- **React 19 + Vite**, JavaScript (JSX)
- **CSS puro**: cada tela tem o próprio arquivo `.css`, e as cores ficam em variáveis no `src/index.css`
- **useState / useEffect**, sem React Router: a troca de tela é um `useState` no `App.jsx`
- **Sem back-end**: os dados ficam no `localStorage` do navegador
- **ESLint**, verificado automaticamente em cada Pull Request

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).
Antes de abrir um PR, rode `npm run lint` e `npm run build`: o GitHub roda os dois e bloqueia se falhar.

## Onde fica cada coisa

```
src/
├── App.jsx                 estado das ocorrências + troca de tela
├── index.css               variáveis de cor e fonte (P5)
├── App.css                 layout geral e menu
├── components/Header.jsx   menu provisório (P3 substitui)
├── data/
│   ├── ocorrencias.js      regras e funções dos dados (P1)
│   └── dadosExemplo.js     elevadores, técnicos e ocorrências de exemplo (P1)
└── telas/
    ├── atendente/          P2
    ├── tecnico/            P3
    └── gestao/             P4
```

Cada pessoa mexe principalmente na própria pasta: assim quase não há conflito no Git.

## Como usar os dados nas telas

Cada ocorrência tem este formato:

```js
{
  id: 'OC-0031',
  tipo: 'passageiro_preso',        // passageiro_preso | falha_tecnica | falta_energia | pedido_cliente
  prioridade: 'critica',           // calculada pelo tipo: critica | alta | media | baixa
  status: 'aberta',                // aberta | em_atendimento | resolvida
  elevadorId: 'EL-07',
  tecnicoId: null,                 // 'TC-02' quando alguém assume
  descricao: 'Pessoa presa no 10º andar',
  solicitante: 'Recepção',
  abertaEm: '2026-09-26T14:00:00.000Z',
  atendimentoEm: null,
  resolvidaEm: null,
  historico: [{ status: 'aberta', data: '...', observacao: 'Ocorrência registrada' }],
}
```

O `App.jsx` entrega para cada tela a lista `ocorrencias` e as ações abaixo (props):

| Tela | Props |
|---|---|
| Atendente | `onRegistrar(dados)` devolve a ocorrência criada · `onEditar(id, mudancas)` · `onExcluir(id)` |
| Técnico | `onAtribuir(id, tecnicoId)` · `onAtualizarStatus(id, status, observacao)` |
| Gestão | só leitura |

Funções prontas em `src/data/ocorrencias.js`:

| Função | Para que serve |
|---|---|
| `validarOcorrencia(dados)` | lista de mensagens de erro do formulário (vazia = pode salvar) |
| `editarOcorrencia(ocorrencia, mudancas)` | corrige tipo, elevador, descrição ou solicitante; se o tipo mudar, recalcula a prioridade e registra no histórico (nas telas, use a prop `onEditar`) |
| `filaDeAtendimento(lista)` | não resolvidas, crítica primeiro e depois a mais antiga |
| `buscarElevador(id)` / `buscarTecnico(id)` | dados do elevador ou do técnico |
| `TIPOS`, `PRIORIDADES`, `STATUS` | rótulos para mostrar na tela (ex.: `TIPOS[o.tipo].rotulo`) |
| `ELEVADORES`, `TECNICOS` | listas para os `<select>` do formulário |

O botão **Restaurar dados de exemplo** no topo volta os 30 exemplos (útil antes de gravar o vídeo).

## Divisão do time

| Pessoa | Integrante | GitHub | Parte | Branch |
|---|---|---|---|---|
| P1 | Pedro Zigiotto | [@DevPedroZigi](https://github.com/DevPedroZigi) | Dados, regras e deploy | `p1-dados` |
| P2 | Pedro Henrique | [@phthedevx](https://github.com/phthedevx) | Tela do atendente + slides da banca | `p2-atendente` |
| P3 | Julia Rubio | [@Jurubioo2007](https://github.com/Jurubioo2007) | Tela do técnico + navegação | `p3-tecnico` |
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

- Deploy: https://skyrise-otis.vercel.app (atualiza sozinho a cada merge na `main`)
- Vídeo Sprint 1: https://youtu.be/Gt166Ju_NXw
- Vídeo Sprint 2: _a definir_
