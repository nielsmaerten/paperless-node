import { config as loadEnv, type DotenvConfigOptions } from 'dotenv';
import type { PaperlessClientOptions } from '../core/paperlessClient.js';

/**
 * Configuration values that can be sourced from environment variables.
 */
export interface EnvConfig {
  baseURL?: string;
  token?: string;
  tokenPrefix?: string;
  headerName?: string;
}

/**
 * Controls how environment variables are loaded before being read.
 */
export interface LoadEnvOptions {
  dotenv?: boolean | DotenvConfigOptions;
}

/**
 * Loads environment variables relevant to the SDK and returns their parsed values.
 */
export const loadPaperlessEnv = ({ dotenv = true }: LoadEnvOptions = {}): EnvConfig => {
  if (dotenv) {
    const options = typeof dotenv === 'object' ? dotenv : undefined;
    loadEnv(options);
  }

  return {
    baseURL: process.env.PAPERLESS_BASE_URL ?? process.env.PAPERLESS_URL,
    token: process.env.PAPERLESS_TOKEN ?? process.env.PAPERLESS_API_TOKEN,
    tokenPrefix: process.env.PAPERLESS_TOKEN_PREFIX,
    headerName: process.env.PAPERLESS_AUTH_HEADER,
  };
};

/**
 * Builds {@link PaperlessClientOptions} by combining environment variables with explicit defaults.
 */
export const createOptionsFromEnv = (
  { defaults, dotenv }: LoadEnvOptions & { defaults?: Partial<PaperlessClientOptions> } = {},
): PaperlessClientOptions => {
  const envConfig = loadPaperlessEnv({ dotenv });
  const baseURL = envConfig.baseURL ?? defaults?.baseURL;

  if (!baseURL) {
    throw new Error('Paperless base URL is required. Set PAPERLESS_BASE_URL or provide baseURL.');
  }

  return {
    ...defaults,
    baseURL,
    token: envConfig.token ?? defaults?.token,
    tokenPrefix: envConfig.tokenPrefix ?? defaults?.tokenPrefix,
    headerName: envConfig.headerName ?? defaults?.headerName,
  } satisfies PaperlessClientOptions;
};
