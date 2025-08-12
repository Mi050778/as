# SorteOnline Replica

- Front-end mirrored into `public/site`
- Express server serves and proxies routes; local mocks under `/api/*`

## Rodar

```bash
npm run dev
# abrir http://localhost:3000
```

## Estrutura
- `server/index.js`: servidor, espelho `/mirror/:host/*`, proxies e mocks
- `public/`: assets baixados e cache de mirror
- `docs/routes.json`: log de rotas acessadas (método, URL, host, tipo)

## Observação
- O HTML inicial é reescrito para apontar para `/mirror/*`. Ao navegar, os assets são baixados e cacheados localmente automaticamente.