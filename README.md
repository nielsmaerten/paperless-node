# paperless-node

Type-safe TypeScript client for the Paperless-ngx REST API, generated from the official OpenAPI specification.

## Features

- HTTP client with automatic auth header injection and structured error handling.
- Strongly typed resources for documents, correspondents, tags, document types, tasks, users, and authentication flows.
- Helpers for working with environment variables and paginated endpoints.
- `tsup` build pipeline with dual ESM/CJS output and bundled type definitions.

## Installation

```bash
pnpm add paperless-node
# or
npm install paperless-node
```

## Quick start

```ts
import { createPaperlessClient } from 'paperless-node';

const client = createPaperlessClient({
  baseURL: process.env.PAPERLESS_BASE_URL!,
  token: process.env.PAPERLESS_TOKEN,
});

const documents = await client.documents.list({ page_size: 10 });
console.log(documents.results.map(doc => doc.title));
```

More scenarios live in [`EXAMPLES.md`](./EXAMPLES.md), which mirrors the integration flows in the test suite.

### Loading configuration from `.env`

```ts
import { createOptionsFromEnv, createPaperlessClient } from 'paperless-node';

const options = createOptionsFromEnv();
const client = createPaperlessClient(options);
```

Supported environment variables:

- `PAPERLESS_BASE_URL` (required if not provided programmatically)
- `PAPERLESS_TOKEN`
- `PAPERLESS_TOKEN_PREFIX`
- `PAPERLESS_AUTH_HEADER`

## Working with documents

```ts
const { results } = await client.documents.list({ ordering: '-created' });
const [first] = results;

await client.documents.addNote(first.id, { note: 'Reviewed and filed.' });
await client.documents.download(first.id, { responseType: 'stream' });
```

## Scripts

- `pnpm run generate` — regenerate TypeScript types from `docs/paperless-rest-api.yaml`.
- `pnpm run build` — bundle ESM + CJS outputs and emit type declarations.
- `pnpm run test` — run Vitest in watch mode.
- `pnpm run test:run` — run the Vitest suite once.
- `pnpm run typecheck` — ensure the project passes TypeScript checks.

## Development workflow

1. Update `docs/paperless-rest-api.yaml` with the latest Paperless-ngx schema.
2. Run `pnpm run generate` to refresh generated types.
3. Implement resource changes in `src/resources` and add tests in `tests/`.
4. Execute `pnpm run test:run` and `pnpm run typecheck`.
5. Build the package via `pnpm run build`.

## License

MIT
