import { describe, expect, it, beforeEach } from 'vitest';
import AxiosMockAdapter from 'axios-mock-adapter';
import { HttpClient } from '../src/core/httpClient.js';
import { DocumentsResource } from '../src/resources/documents.js';

const baseURL = 'https://paperless.test';

const getAxiosInstance = (client: HttpClient) =>
  (client as unknown as { instance: unknown }).instance as import('axios').AxiosInstance;

const createDocumentsResource = () => {
  const http = new HttpClient({ baseURL });
  const instance = getAxiosInstance(http);
  const mock = new AxiosMockAdapter(instance);
  return { documents: new DocumentsResource(http), mock, instance };
};

describe('DocumentsResource', () => {
  let documents: DocumentsResource;
  let mock: AxiosMockAdapter;
  let instance: import('axios').AxiosInstance;

  beforeEach(() => {
    ({ documents, mock, instance } = createDocumentsResource());
    mock.resetHistory();
  });

  it('requests document by id with query params', async () => {
    mock.onGet('/api/documents/42/').reply(200, { id: 42 });

    const result = await documents.retrieve(42, { fields: ['title'] });
    expect(result).toEqual({ id: 42 });
    expect(mock.history.get).toHaveLength(1);
    const uri = instance.getUri(mock.history.get[0]!);
    const parsed = new URL(uri);
    expect(parsed.pathname).toBe('/api/documents/42/');
    expect(parsed.search).toBe('?fields=title');
  });

  it('deletes a note with note id query param', async () => {
    mock.onDelete('/api/documents/42/notes/').reply(200, { results: [] });

    await documents.removeNote(42, 7);
    expect(mock.history.delete).toHaveLength(1);
    const uri = instance.getUri(mock.history.delete[0]!);
    const parsed = new URL(uri);
    expect(parsed.pathname).toBe('/api/documents/42/notes/');
    expect(parsed.search).toBe('?id=7');
  });

  it('sends note body when creating', async () => {
    mock.onPost('/api/documents/42/notes/').reply(config => {
      expect(config.data).toBe(JSON.stringify({ note: 'Hello' }));
      return [200, { results: [] }];
    });

    await documents.addNote(42, { note: 'Hello' });
    expect(mock.history.post).toHaveLength(1);
  });
});
