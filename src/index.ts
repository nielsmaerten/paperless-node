export { PaperlessApiError } from './core/errors.js';
export { HttpClient } from './core/httpClient.js';
export type { HttpClientOptions } from './core/httpClient.js';
export { PaperlessClient, createPaperlessClient } from './core/paperlessClient.js';
export type { PaperlessClientOptions } from './core/paperlessClient.js';
export * from './core/types.js';

export { DocumentsResource } from './resources/documents.js';
export { DocumentTypesResource } from './resources/documentTypes.js';
export { CorrespondentsResource } from './resources/correspondents.js';
export { TagsResource } from './resources/tags.js';
export { TasksResource } from './resources/tasks.js';
export { UsersResource } from './resources/users.js';
export { AuthResource } from './resources/auth.js';

export { loadPaperlessEnv, createOptionsFromEnv } from './utils/env.js';
export { buildPath } from './utils/url.js';
