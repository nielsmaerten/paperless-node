import type { operations as GeneratedOperations, components as GeneratedComponents, paths as GeneratedPaths } from '../generated/types';

type ContentTypes =
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'application/octet-stream'
  | 'text/plain'
  | '*/*';

type ExtractContent<T> = T extends { [K in ContentTypes]?: infer U }
  ? Exclude<U, undefined>
  : T extends { [key: string]: infer U }
    ? U
    : unknown;

type ExtractResponse<T> = T extends { content: infer Content }
  ? ExtractContent<Content>
  : void;

type ExtractRequestBody<T> = T extends { content: infer Content }
  ? ExtractContent<Content>
  : undefined;

type ExtractQuery<T> = T extends { query?: infer Q } ? Q : undefined;

type ExtractPath<T> = T extends { path: infer P } ? P : undefined;

export type Components = GeneratedComponents;
export type Operations = GeneratedOperations;
export type Paths = GeneratedPaths;

export type Schema<T extends keyof Components['schemas']> = Components['schemas'][T];

export type OperationNames = keyof Operations;

type OperationDefinition<T extends OperationNames> = Operations[T];

export type OperationParameters<T extends OperationNames> = OperationDefinition<T> extends {
  parameters?: infer P;
}
  ? NonNullable<P>
  : Record<string, never>;

export type OperationQuery<T extends OperationNames> = ExtractQuery<OperationParameters<T>>;

export type OperationPathParams<T extends OperationNames> = ExtractPath<OperationParameters<T>>;

export type OperationRequestBody<T extends OperationNames> = ExtractRequestBody<
  OperationDefinition<T> extends { requestBody?: infer R }
    ? R
    : undefined
>;

type OperationResponses<T extends OperationNames> = OperationDefinition<T> extends { responses: infer R }
  ? NonUndefined<R>
  : never;

type ResponseStatuses<T extends OperationNames> = keyof OperationResponses<T>;

type NumericStatuses<T extends OperationNames> = Extract<ResponseStatuses<T>, number>;

type ChooseDefaultStatus<T> = [T] extends [never]
  ? never
  : 200 extends T
    ? 200
    : 201 extends T
      ? 201
      : 202 extends T
        ? 202
        : 204 extends T
          ? 204
          : T;

type DefaultStatus<T extends OperationNames> = ChooseDefaultStatus<NumericStatuses<T>> extends never
  ? ResponseStatuses<T>
  : ChooseDefaultStatus<NumericStatuses<T>>;

export type OperationResponse<
  T extends OperationNames,
  Status extends ResponseStatuses<T> = DefaultStatus<T>,
> = OperationResponses<T> extends never
  ? void
  : Status extends keyof OperationResponses<T>
    ? ExtractResponse<OperationResponses<T>[Status]>
    : void;

export interface PaginatedResponse<T> {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
  all?: unknown[];
}

export type NonUndefined<T> = T extends undefined ? never : T;
