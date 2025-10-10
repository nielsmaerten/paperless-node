# Usage Examples

The snippets below mirror the flows covered by `tests/integration.test.ts`. They assume you have a running Paperless-ngx instance and that your environment variables (see `createOptionsFromEnv`) are set.

## Bootstrapping the client

```ts
import { createOptionsFromEnv, PaperlessClient } from 'paperless-client';

const options = createOptionsFromEnv();
const client = new PaperlessClient(options);
```

## Retrieve a document by ID

```ts
const documentId = 1337;
const document = await client.documents.retrieve(documentId);

console.log(`Fetched ${document.title} (#${document.id})`);
```

## Explore tags

```ts
const tags = await client.tags.list();

for (const tag of tags.results) {
  console.log(`#${tag.id} ${tag.name} (${tag.document_count} docs)`);
}
```

### Create and delete a tag

```ts
const tagName = `test-tag-${Date.now()}`;
const newTag = await client.tags.create({ name: tagName });

try {
  console.log('Created tag:', newTag);
  // ... use the tag in downstream calls ...
} finally {
  await client.tags.remove(newTag.id);
}
```

## Work with correspondents

```ts
const correspondents = await client.correspondents.list();
console.log('First correspondent:', correspondents.results[0]);

const correspondentName = `example-${Date.now()}`;
const correspondent = await client.correspondents.create({ name: correspondentName });
await client.correspondents.remove(correspondent.id);
```

## Manage document types

```ts
const docTypes = await client.documentTypes.list();
console.log('Available types:', docTypes.results.map(type => type.name));

const newType = await client.documentTypes.create({ name: 'Temp Type' });
await client.documentTypes.remove(newType.id);
```

## Filter documents by tag

```ts
const { results: tagList } = await client.tags.list();
const tagWithDocs = tagList.find(tag => tag.document_count > 0);

if (tagWithDocs) {
  const documents = await client.documents.list({ tags__id: tagWithDocs.id });
  console.log(`Documents tagged with ${tagWithDocs.name}:`, documents.results.map(doc => doc.title));
}
```

## Additional helpers

- `client.documents.upload()` accepts `Buffer`, `Readable`, `Blob`, or file paths for ingestion.
- `client.documents.addNote()` / `removeNote()` manage per-document notes.
- `client.tasks.run()` triggers Paperless background tasks.

See `tests/integration.test.ts` for end-to-end usage patterns you can adapt to scripts or automation.
