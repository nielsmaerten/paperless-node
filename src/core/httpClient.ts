import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
} from 'axios';
import qs from 'qs';
import { PaperlessApiError } from './errors.js';

export interface HttpClientOptions {
  baseURL: string;
  token?: string;
  tokenPrefix?: string;
  headerName?: string;
  timeout?: number;
  userAgent?: string;
  axiosConfig?: AxiosRequestConfig;
}

export interface RequestOptions<T> extends AxiosRequestConfig<T> {
  method?: Method;
}

export class HttpClient {
  private readonly instance: AxiosInstance;
  private token?: string;
  private tokenPrefix?: string;
  private readonly headerName: string;

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

  setToken(token: string | null, options?: { prefix?: string }): void {
    this.token = token ?? undefined;
    if (options?.prefix !== undefined) {
      this.tokenPrefix = options.prefix ?? undefined;
    }
  }

  clearToken(): void {
    this.token = undefined;
  }

  async request<TResponse = unknown, TData = unknown>(config: RequestOptions<TData>): Promise<TResponse> {
    try {
      const response = await this.instance.request<TResponse, AxiosResponse<TResponse, TData>, TData>(config);
      return response.data;
    } catch (error) {
      throw PaperlessApiError.from(error);
    }
  }

  get<TResponse = unknown>(url: string, config: RequestOptions<unknown> = {}): Promise<TResponse> {
    return this.request<TResponse>({ ...config, method: 'GET', url });
  }

  post<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config: RequestOptions<TData> = {},
  ): Promise<TResponse> {
    return this.request<TResponse, TData>({ ...config, method: 'POST', url, data });
  }

  put<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config: RequestOptions<TData> = {},
  ): Promise<TResponse> {
    return this.request<TResponse, TData>({ ...config, method: 'PUT', url, data });
  }

  patch<TResponse = unknown, TData = unknown>(
    url: string,
    data?: TData,
    config: RequestOptions<TData> = {},
  ): Promise<TResponse> {
    return this.request<TResponse, TData>({ ...config, method: 'PATCH', url, data });
  }

  delete<TResponse = unknown>(
    url: string,
    config: RequestOptions<unknown> = {},
  ): Promise<TResponse> {
    return this.request<TResponse>({ ...config, method: 'DELETE', url });
  }

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
