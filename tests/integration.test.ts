import { describe, it, expect, beforeAll } from "vitest";
import { createOptionsFromEnv, PaperlessClient } from "../src/index";

let client: PaperlessClient;
const RUN_INTEGRATION_TESTS = process.env.RUN_INTEGRATION_TESTS === "true";

describe.skipIf(!RUN_INTEGRATION_TESTS)("Integration Tests", () => {
  beforeAll(() => {
    const options = createOptionsFromEnv();
    client = new PaperlessClient(options);
  });

  it("fetches a document by ID", async () => {
    const document = await client.documents.retrieve(1337);
    expect(document).toBeDefined();
    expect(document.id).toBe(1337);
  });

  it("fetches a list of tags", async () => {
    const tags = await client.tags.list();
    expect(tags).toBeDefined();
    expect(tags.results.length).toBeGreaterThan(0);
    expect(tags.results[0]).toHaveProperty("name");
    expect(tags.results[0]).toHaveProperty("id");
  });

  it("creates and deletes a tag", async () => {
    const tagName = `test-tag-${Date.now()}`;
    const newTag = await client.tags.create({ name: tagName });
    expect(newTag).toBeDefined();
    expect(newTag.name).toBe(tagName);

    await client.tags.remove(newTag.id);
    const deletedTag = await client.tags.retrieve(newTag.id).catch(() => null);
    expect(deletedTag).toBeNull();
  });

  it("fethes a list of correspondents", async () => {
    const correspondents = await client.correspondents.list();
    expect(correspondents).toBeDefined();
    expect(correspondents.results.length).toBeGreaterThan(0);
    expect(correspondents.results[0]).toHaveProperty("name");
    expect(correspondents.results[0]).toHaveProperty("id");
  });

  it("creates and deletes a correspondent", async () => {
    const correspondentName = `test-correspondent-${Date.now()}`;
    const newCorrespondent = await client.correspondents.create({ name: correspondentName });
    expect(newCorrespondent).toBeDefined();
    expect(newCorrespondent.name).toBe(correspondentName);

    await client.correspondents.remove(newCorrespondent.id);
    const deletedCorrespondent = await client.correspondents.retrieve(newCorrespondent.id).catch(() => null);
    expect(deletedCorrespondent).toBeNull();
  });

  it("fetches a list of document types", async () => {
    const documentTypes = await client.documentTypes.list();
    expect(documentTypes).toBeDefined();
    expect(documentTypes.results.length).toBeGreaterThan(0);
    expect(documentTypes.results[0]).toHaveProperty("name");
    expect(documentTypes.results[0]).toHaveProperty("id");
  });

  it("creates and deletes a document type", async () => {
    const docTypeName = `test-document-type-${Date.now()}`;
    const newDocType = await client.documentTypes.create({ name: docTypeName });
    expect(newDocType).toBeDefined();
    expect(newDocType.name).toBe(docTypeName);

    await client.documentTypes.remove(newDocType.id);
    const deletedDocType = await client.documentTypes.retrieve(newDocType.id).catch(() => null);
    expect(deletedDocType).toBeNull();
  });

  it("fetches a list documents by tag", async () => {
    const tags = await client.tags.list();
    expect(tags.results.length).toBeGreaterThan(0);
    const tag = tags.results.find(tag => tag.document_count > 0);
    expect(tag).toBeDefined();

    const documents = await client.documents.list({ tags__id: tag.id });
    expect(documents).toBeDefined();
    expect(documents.results.length).toBeGreaterThan(0);
    expect(documents.results[0]).toHaveProperty("id");
    expect(documents.results[0]).toHaveProperty("title");
  });

});