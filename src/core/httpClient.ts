import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
} from 'axios';
import qs from 'qs';
import { PaperlessApiError } from './errors.js';

/**
 * Configuration options accepted by {@link HttpClient}.
 */
export interface HttpClientOptions {
  baseURL: string;
  token?: string;
  tokenPrefix?: string;
  headerName?: string;
  timeout?: number;
  userAgent?: string;
  axiosConfig?: AxiosRequestConfig;
}

/**
 * Lightweight extension of Axios request options used by {@link HttpClient}.
 */
export interface RequestOptions<T> extends AxiosRequestConfig<T> {
  method?: Method;
}

/**
 * Thin wrapper around Axios that applies Paperless defaults and error handling.
 */
export class HttpClient {
  private readonly instance: AxiosInstance;
  private token?: string;
  private tokenPrefix?: string;
  private readonly headerName: string;

  /**
   * Creates a new {@link HttpClient} instance with sensible defaults for the Paperless API.
   */
  constructor({
    baseURL,
    token,
    tokenPrefix,
    headerName,
    timeout = 10000,
    userAgent = 'paperless-node',
    axiosConfig,
  }: HttpClientOptions) {
    this.instance = axios.create({
      baseURL,
      timeout,
      headers: {
        Accept: 'application/json',
        'User-Agent': userAgent,
        ...axiosConfig?.headers,
      },
      paramsSerializer: params =>
        qs.stringify(params, {
          arrayFormat: 'comma',
          skipNulls: true,
          encodeValuesOnly: true,
        }),
      ...axiosConfig,
    });

    this.token = token ?? undefined;
    this.tokenPrefix = tokenPrefix ?? (token ? 'Token' : undefined);
    this.headerName = headerName ?? 'Authorization';

    this.instance.interceptors.request.use((config) => {
      if (this.token) {
        const headerValue = this.tokenPrefix ? `${this.tokenPrefix} ${this.token}` : this.token;
        const headers = config.headers instanceof AxiosHeaders ? config.headers : new AxiosHeaders(config.headers);
        if (!headers.has(this.headerName)) {
          headers.set(this.headerName, headerValue);
        }
        config.headers = headers;
      }
      return config;
    });
  }

  /**
   * Updates the bearer token used for subsequent requests.
   */
  setToken(token: string | null, options?: { prefix?: string }): void {
    this.token = token ?? undefined;
    if (options?.prefix !== undefined) {
      this.tokenPrefix = options.prefix ?? undefined;
    }
  }

  /**
   * Removes the currently configured token so future requests are unauthenticated.
   */
  clearToken(): void {
    this.token = undefined;
  }

  /**
   * Performs a raw HTTP request and unwraps the response payload, normalizing errors along the way.
   */
  async request<TResponse = unknown, TData = unknown>(config: RequestOptions<TData>): Promise<TResponse> {
    try {
      const response = await this.instance.request<TResponse, AxiosResponse<TResponse, TData>, TData>(config);
      return response.data;
    } catch (error) {
      throw PaperlessApiError.from(error);
    }
  }

  /**
   * Performs a `GET` request.
   */
  get<TResponse = unknown>(url: string, config: RequestOptions<unknown> = {}): Promise<TResponse> {
    return this.request<TResponse>({ ...config, method: 'GET', url });
  }

  /**
   * Performs a `POST` request.
   */
  post<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config: RequestOptions<TData> = {},
  ): Promise<TResponse> {
    return this.request<TResponse, TData>({ ...config, method: 'POST', url, data });
  }

  /**
   * Performs a `PUT` request.
   */
  put<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config: RequestOptions<TData> = {},
  ): Promise<TResponse> {
    return this.request<TResponse, TData>({ ...config, method: 'PUT', url, data });
  }

  /**
   * Performs a `PATCH` request.
   */
  patch<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config: RequestOptions<TData> = {},
  ): Promise<TResponse> {
    return this.request<TResponse, TData>({ ...config, method: 'PATCH', url, data });
  }

  /**
   * Performs a `DELETE` request.
   */
  delete<TResponse = unknown>(
    url: string,
    config: RequestOptions<unknown> = {},
  ): Promise<TResponse> {
    return this.request<TResponse>({ ...config, method: 'DELETE', url });
  }

  /**
   * Iterates over paginated endpoints until exhausted, yielding each item lazily.
   */
  async *iteratePaginated<TItem>(config: RequestOptions<unknown>): AsyncGenerator<TItem, void, unknown> {
    let nextConfig: RequestOptions<unknown> | undefined = { ...config };
    while (nextConfig) {
      const page: PaginatedEnvelope<TItem> = await this.request<PaginatedEnvelope<TItem>>(nextConfig);
      for (const item of page.results) {
        yield item;
      }
      if (!page.next) {
        break;
      }
      nextConfig = {
        ...config,
        url: page.next,
        params: undefined,
        baseURL: undefined,
      };
    }
  }

  /**
   * Collects every page from a paginated endpoint and returns the aggregated list.
   */
  async listAll<TItem>(config: RequestOptions<unknown>): Promise<TItem[]> {
    const items: TItem[] = [];
    for await (const item of this.iteratePaginated<TItem>(config)) {
      items.push(item);
    }
    return items;
  }
}

interface PaginatedEnvelope<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}
