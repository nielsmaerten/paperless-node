import FormData from 'form-data';
import { HttpClient } from '../core/httpClient.js';
import { buildPath } from '../utils/url.js';
import type {
  NonUndefined,
  OperationPathParams,
  OperationQuery,
  OperationRequestBody,
  OperationResponse,
  Schema,
} from '../core/types.js';

type Document = Schema<'Document'>;
type DocumentRequest = NonUndefined<OperationRequestBody<'documents_update'>>;
type DocumentPatch = NonUndefined<OperationRequestBody<'documents_partial_update'>>;
type DocumentList = OperationResponse<'documents_list'>;
type DocumentHistoryList = OperationResponse<'documents_history_list'>;
type DocumentNotesList = OperationResponse<'documents_notes_list'>;
type DocumentEmailResponse = OperationResponse<'documents_email_create'>;
type DocumentSelectionData = OperationResponse<'documents_selection_data_create'>;

type UploadDocumentRequest = NonUndefined<OperationRequestBody<'documents_post_document_create'>>;

type DocumentsListQuery = OperationQuery<'documents_list'>;
type DocumentsRetrieveParams = OperationQuery<'documents_retrieve'>;
type DocumentsHistoryQuery = OperationQuery<'documents_history_list'>;
type DocumentsNotesQuery = OperationQuery<'documents_notes_list'>;
type DocumentsNotesCreateBody = NonUndefined<OperationRequestBody<'documents_notes_create'>>;

type DocumentPath = OperationPathParams<'documents_retrieve'>;

type PaginatedNotesParams = DocumentsNotesQuery & { id?: number };

type DownloadOptions = {
  original?: boolean;
  responseType?: 'arraybuffer' | 'stream';
};

type UploadFile = Buffer | NodeJS.ReadableStream | Blob | string;

/**
 * Options accepted when uploading a new document, including the raw file content.
 */
export interface UploadDocumentOptions extends Omit<UploadDocumentRequest, 'document'> {
  document: UploadFile;
}

/**
 * Client for interacting with the `/documents` endpoints.
 */
export class DocumentsResource {
  /**
   * @param http Shared HTTP client used to perform API calls.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Returns a single page of documents.
   */
  list(query?: DocumentsListQuery): Promise<DocumentList> {
    return this.http.get<DocumentList>('/api/documents/', { params: query });
  }

  /**
   * Lazily iterates through every page of documents.
   */
  async *iterate(query?: DocumentsListQuery): AsyncGenerator<Document, void, unknown> {
    yield* this.http.iteratePaginated<Document>({
      method: 'GET',
      url: '/api/documents/',
      params: query,
    });
  }

  /**
   * Fetches every document eagerly by walking through all available pages.
   */
  listAll(query?: DocumentsListQuery): Promise<Document[]> {
    return this.http.listAll<Document>({
      method: 'GET',
      url: '/api/documents/',
      params: query,
    });
  }

  /**
   * Retrieves a single document by its numeric identifier.
   */
  retrieve(id: DocumentPath['id'], query?: DocumentsRetrieveParams): Promise<Document> {
    const url = buildPath('/api/documents/{id}/', { id });
    return this.http.get<Document>(url, { params: query });
  }

  /**
   * Replaces a document with an updated payload.
   */
  update(id: DocumentPath['id'], body: DocumentRequest): Promise<Document> {
    const url = buildPath('/api/documents/{id}/', { id });
    return this.http.put<Document, DocumentRequest>(url, body);
  }

  /**
   * Applies a partial update to an existing document.
   */
  partialUpdate(id: DocumentPath['id'], body: DocumentPatch): Promise<Document> {
    const url = buildPath('/api/documents/{id}/', { id });
    return this.http.patch<Document, DocumentPatch>(url, body);
  }

  /**
   * Deletes a document permanently.
   */
  remove(id: DocumentPath['id']): Promise<void> {
    const url = buildPath('/api/documents/{id}/', { id });
    return this.http.delete<void>(url);
  }

  /**
   * Uploads a new document using multipart form data.
   */
  async upload(options: UploadDocumentOptions): Promise<string> {
    const form = new FormData();
    form.append('document', options.document as any);
    if (options.title) form.append('title', options.title);
    if (options.correspondent !== undefined && options.correspondent !== null) {
      form.append('correspondent', String(options.correspondent));
    }
    if (options.document_type !== undefined && options.document_type !== null) {
      form.append('document_type', String(options.document_type));
    }
    if (options.storage_path !== undefined && options.storage_path !== null) {
      form.append('storage_path', String(options.storage_path));
    }
    if (options.tags) {
      for (const tag of options.tags) {
        form.append('tags', String(tag));
      }
    }
    if (options.archive_serial_number !== undefined && options.archive_serial_number !== null) {
      form.append('archive_serial_number', String(options.archive_serial_number));
    }
    if (options.custom_fields) {
      for (const field of options.custom_fields) {
        form.append('custom_fields', String(field));
      }
    }
    if (options.from_webui !== undefined) {
      form.append('from_webui', String(options.from_webui));
    }
    if (options.created) {
      form.append('created', options.created);
    }

    return this.http.post<string, FormData>('/api/documents/post_document/', form, {
      headers: form.getHeaders(),
    });
  }

  /**
   * Downloads the binary document as either an `ArrayBuffer` or a streaming response.
   */
  async download(
    id: DocumentPath['id'],
    { original, responseType = 'arraybuffer' }: DownloadOptions = {},
  ): Promise<ArrayBuffer | NodeJS.ReadableStream> {
    const url = buildPath('/api/documents/{id}/download/', { id });
    const params = original === undefined ? undefined : { original };

    if (responseType === 'stream') {
      return this.http.get<NodeJS.ReadableStream>(url, {
        params,
        responseType,
      });
    }

    return this.http.get<ArrayBuffer>(url, {
      params,
      responseType,
    });
  }

  /**
   * Lists the audit history for a document.
   */
  history(id: DocumentPath['id'], query?: DocumentsHistoryQuery): Promise<DocumentHistoryList> {
    const url = buildPath('/api/documents/{id}/history/', { id });
    return this.http.get<DocumentHistoryList>(url, { params: query });
  }

  /**
   * Retrieves notes for a document with optional pagination controls.
   */
  notes(id: DocumentPath['id'], query?: DocumentsNotesQuery): Promise<DocumentNotesList> {
    const url = buildPath('/api/documents/{id}/notes/', { id });
    return this.http.get<DocumentNotesList>(url, { params: query });
  }

  /**
   * Adds a new note to the specified document.
   */
  addNote(id: DocumentPath['id'], body: DocumentsNotesCreateBody): Promise<DocumentNotesList> {
    const url = buildPath('/api/documents/{id}/notes/', { id });
    return this.http.post<DocumentNotesList, DocumentsNotesCreateBody>(url, body);
  }

  /**
   * Removes the provided note from the document.
   */
  removeNote(id: DocumentPath['id'], noteId: number): Promise<DocumentNotesList> {
    const url = buildPath('/api/documents/{id}/notes/', { id });
    const params: PaginatedNotesParams = { id: noteId };
    return this.http.delete<DocumentNotesList>(url, { params });
  }

  /**
   * Sends the document by email using the server-side mailer.
   */
  sendByEmail(id: DocumentPath['id'], body: NonUndefined<OperationRequestBody<'documents_email_create'>>): Promise<DocumentEmailResponse> {
    const url = buildPath('/api/documents/{id}/email/', { id });
    return this.http.post<DocumentEmailResponse, typeof body>(url, body);
  }

  /**
   * Fetches selection helper data (such as tags or correspondents) to assist upload flows.
   */
  selectionData(body: NonUndefined<OperationRequestBody<'documents_selection_data_create'>>): Promise<DocumentSelectionData> {
    return this.http.post<DocumentSelectionData, typeof body>('/api/documents/selection_data/', body);
  }
}
