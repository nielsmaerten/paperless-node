import { describe, expect, it, beforeEach } from 'vitest';
import AxiosMockAdapter from 'axios-mock-adapter';
import { HttpClient } from '../src/core/httpClient.js';
import { PaperlessApiError } from '../src/core/errors.js';

const baseURL = 'https://paperless.test';

const createClient = () => new HttpClient({ baseURL, token: 'secret' });

const getAxiosInstance = (client: HttpClient) =>
  (client as unknown as { instance: unknown }).instance as import('axios').AxiosInstance;

describe('HttpClient', () => {
  let client: HttpClient;
  let mock: AxiosMockAdapter;

  beforeEach(() => {
    client = createClient();
    mock = new AxiosMockAdapter(getAxiosInstance(client));
    mock.resetHistory();
  });

  it('adds authorization header when token is present', async () => {
    mock.onGet('/documents').reply(config => {
      expect(config.headers?.Authorization).toBe('Token secret');
      return [200, { ok: true }];
    });

    const response = await client.get<{ ok: boolean }>('/documents');
    expect(response.ok).toBe(true);
  });

  it('serializes array query params with comma separation', async () => {
    mock.onGet('/documents').reply(200, { ok: true });

    await client.get<{ ok: boolean }>('/documents', {
      params: {
        id__in: [1, 2, 3],
        search: 'Invoice',
      },
    });

    expect(mock.history.get).toHaveLength(1);
    const [request] = mock.history.get;
    const uri = getAxiosInstance(client).getUri(request);
    const parsed = new URL(uri);
    expect(parsed.pathname).toBe('/documents');
    expect(parsed.search).toBe('?id__in=1,2,3&search=Invoice');
  });

  it('cascades paginate requests with iteratePaginated', async () => {
    mock
      .onGet('/api/items')
      .replyOnce(200, {
        count: 3,
        next: '/api/items?page=2',
        previous: null,
        results: [1, 2],
      })
      .onGet('/api/items?page=2')
      .replyOnce(200, {
        count: 3,
        next: null,
        previous: '/api/items',
        results: [3],
      });

    const results = await client.listAll<number>({ method: 'GET', url: '/api/items' });
    expect(results).toEqual([1, 2, 3]);
  });

  it('wraps axios errors as PaperlessApiError', async () => {
    mock.onGet('/documents').reply(500, { detail: 'Boom' });

    await expect(client.get('/documents')).rejects.toBeInstanceOf(PaperlessApiError);
    await expect(client.get('/documents')).rejects.toMatchObject({
      status: 500,
      data: { detail: 'Boom' },
    });
  });
});
