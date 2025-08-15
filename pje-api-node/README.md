# PJE API (Node.js)

API para autenticar no SSO (Keycloak) do PJe TRF1 e executar a consulta de processos via JSF/Ajax.

## Configuração

1. Copie `.env.example` para `.env` e ajuste as variáveis.
2. Instale dependências e rode o servidor:

```bash
npm install
npm run start
```

## Endpoints

- POST `/login`
  - body: `{ "username": "...", "password": "..." }`
  - resposta: `{ ok, viewState, jar }`
  - Guarde `jar` e `viewState` para as chamadas seguintes.

- POST `/search`
  - body: `{ jar, viewState, params }`
  - `params` exemplos: `{ numeroOAB: "22300", ufOABCombo: "8", valorCausaInicial: "10.000,00", valorCausaFinal: "10.000.000,00" }`
  - resposta: `{ ok, xml, parsed }` (JSF partial-response)

- POST `/paginate`
  - body: `{ jar, viewState, totalCount, action }`
  - `action`: `next`, `previous`, `fastforward`, `fastrewind`

## Observações

- O sistema usa ISO-8859-1 em algumas páginas; a API converte para UTF-8.
- A paginação depende de `processosGridCount` (total de resultados) e do `javax.faces.ViewState` corrente.
- Evite trafegar credenciais em texto claro fora do ambiente seguro.

## Integração com bot de WhatsApp

- Fluxo típico: `login` → `search` → parse dos resultados → `paginate` até coletar todas as páginas.
- Envie apenas os dados relevantes ao usuário final (número do processo, classe, órgão, última movimentação, etc.).