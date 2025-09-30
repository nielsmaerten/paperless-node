import type { HttpClientOptions } from './httpClient.js';
import { HttpClient } from './httpClient.js';
import { AuthResource } from '../resources/auth.js';
import { CorrespondentsResource } from '../resources/correspondents.js';
import { DocumentTypesResource } from '../resources/documentTypes.js';
import { DocumentsResource } from '../resources/documents.js';
import { TagsResource } from '../resources/tags.js';
import { TasksResource } from '../resources/tasks.js';
import { UsersResource } from '../resources/users.js';

export interface PaperlessClientOptions extends HttpClientOptions {}

export class PaperlessClient {
  readonly http: HttpClient;
  readonly documents: DocumentsResource;
  readonly documentTypes: DocumentTypesResource;
  readonly correspondents: CorrespondentsResource;
  readonly tags: TagsResource;
  readonly tasks: TasksResource;
  readonly users: UsersResource;
  readonly auth: AuthResource;

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

  setToken(token: string | null, options?: { prefix?: string }): void {
    this.http.setToken(token, options);
  }

  clearToken(): void {
    this.http.clearToken();
  }
}

export const createPaperlessClient = (options: PaperlessClientOptions): PaperlessClient =>
  new PaperlessClient(options);
