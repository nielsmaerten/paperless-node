import type { AxiosError } from 'axios';

export interface PaperlessErrorContext {
  status?: number;
  url?: string;
  method?: string;
  data?: unknown;
  headers?: Record<string, unknown>;
  cause?: unknown;
}

export class PaperlessApiError extends Error {
  readonly status?: number;
  readonly url?: string;
  readonly method?: string;
  readonly data?: unknown;
  readonly headers?: Record<string, unknown>;

  constructor(message: string, context: PaperlessErrorContext = {}) {
    super(message);
    this.name = 'PaperlessApiError';
    this.status = context.status;
    this.url = context.url;
    this.method = context.method;
    this.data = context.data;
    this.headers = context.headers;
    if (context.cause) {
      this.cause = context.cause as Error;
    }
  }

  static fromAxiosError(error: AxiosError): PaperlessApiError {
    const message = error.message || 'Unexpected Paperless API error';
    return new PaperlessApiError(message, {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      headers: error.response?.headers,
      cause: error,
    });
  }

  static from(error: unknown): PaperlessApiError {
    if (isAxiosError(error)) {
      return PaperlessApiError.fromAxiosError(error);
    }
    if (error instanceof PaperlessApiError) {
      return error;
    }
    if (error instanceof Error) {
      return new PaperlessApiError(error.message, { cause: error });
    }
    return new PaperlessApiError('Unknown Paperless API error', { data: error });
  }
}

const isAxiosError = (error: unknown): error is AxiosError =>
  typeof error === 'object' && error !== null && 'isAxiosError' in error;
