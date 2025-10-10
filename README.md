# paperless-node

Type-safe TypeScript client for the Paperless-ngx REST API. Based on the official [OpenAPI spec](https://docs.paperless-ngx.com/api/).

[![package version](https://img.shields.io/npm/v/paperless-node?color=blue)](https://www.npmjs.com/package/paperless-node)
[![typescript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/paperless-node?color=orange)](https://www.npmjs.com/package/paperless-node)
[![license](https://img.shields.io/npm/l/paperless-node?color=green)](https://opensource.org/licenses/MIT)

## Installation

```bash
pnpm add paperless-node
# or
npm install paperless-node
yarn add paperless-node
```

## Getting started

### Initialize the client

```ts
import { createPaperlessClient } from 'paperless-node';

const client = createPaperlessClient({
  baseURL: 'https://paperless.example.com',
  token: 'example_api_key',
});
```
> Tip: generate an API token from **Paper less-ngx → Profile → API tokens** and keep it secret.


## Common use cases


### Fetch the latest documents

```ts
const { results: documents } = await client.documents.list({
  ordering: '-created',
  page_size: 5,
});

documents.forEach(doc => {
  console.log(`${doc.id} · ${doc.title}`);
});
```

### Fetch available tags

```ts
const { results: tags } = await client.tags.list({ ordering: 'name' });

tags.forEach(tag => {
  console.log(`#${tag.id} ${tag.name} (${tag.document_count} docs)`);
});
```

### Get a tag's ID by name

```ts
const tagName = 'invoices';
const { results: matchingTags } = await client.tags.list({
  name: tagName,
});

const tagId = matchingTags[0]?.id;
```

### Upload a new document

```ts
import { createReadStream } from 'node:fs';

const ingestionId = await client.documents.upload({
  document: createReadStream('./receipts/2024-09-coffee.pdf'),
  title: 'Coffee receipt — Sep 2024',
  correspondent: 42,
  tags: [3, 7],
});

console.log(`Queued for ingestion with id ${ingestionId}`);
```

### Add a tag to a document

```ts
const documentId = 1337;
const tagIdToAdd = 7;

const current = await client.documents.retrieve(documentId);
const currentTags = current.tags ?? [];

const updated = await client.documents.partialUpdate(documentId, {
  tags: Array.from(new Set([...currentTags, tagIdToAdd])),
});

console.log(`Document ${updated.id} now has tags ${updated.tags?.join(', ')}`);
```

### List documents by correspondent

```ts
const correspondentId = 12;

const { results: fromCorrespondent } = await client.documents.list({
  correspondent__id: correspondentId,
  ordering: '-created',
});

fromCorrespondent.forEach(doc => {
  console.log(`[${doc.created}] ${doc.title}`);
});
```

## Extended documentation
- Deepwiki: https://deepwiki.com/nielsmaerten/paperless-node
- More example: [EXAMPLES.md](./EXAMPLES.md)