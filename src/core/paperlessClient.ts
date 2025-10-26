import type { HttpClientOptions } from './httpClient.js';
import { HttpClient } from './httpClient.js';
import { AuthResource } from '../resources/auth.js';
import { CorrespondentsResource } from '../resources/correspondents.js';
import { DocumentTypesResource } from '../resources/documentTypes.js';
import { DocumentsResource } from '../resources/documents.js';
import { TagsResource } from '../resources/tags.js';
import { TasksResource } from '../resources/tasks.js';
import { UsersResource } from '../resources/users.js';

/**
 * Configuration options for {@link PaperlessClient}.
 */
export interface PaperlessClientOptions extends HttpClientOptions {}

/**
 * High-level SDK surface that aggregates every Paperless resource under a single entry point.
 */
export class PaperlessClient {
  readonly http: HttpClient;
  readonly documents: DocumentsResource;
  readonly documentTypes: DocumentTypesResource;
  readonly correspondents: CorrespondentsResource;
  readonly tags: TagsResource;
  readonly tasks: TasksResource;
  readonly users: UsersResource;
  readonly auth: AuthResource;

  /**
   * Creates a new {@link PaperlessClient} using the provided HTTP options.
   */
  constructor(options: PaperlessClientOptions) {
    this.http = new HttpClient(options);
    this.documents = new DocumentsResource(this.http);
    this.documentTypes = new DocumentTypesResource(this.http);
    this.correspondents = new CorrespondentsResource(this.http);
    this.tags = new TagsResource(this.http);
    this.tasks = new TasksResource(this.http);
    this.users = new UsersResource(this.http);
    this.auth = new AuthResource(this.http);
  }

  /**
   * Updates the token shared by all resource instances.
   */
  setToken(token: string | null, options?: { prefix?: string }): void {
    this.http.setToken(token, options);
  }

  /**
   * Clears the token shared by all resource instances.
   */
  clearToken(): void {
    this.http.clearToken();
  }
}

/**
 * Convenience helper that creates a {@link PaperlessClient}.
 */
export const createPaperlessClient = (options: PaperlessClientOptions): PaperlessClient =>
  new PaperlessClient(options);
