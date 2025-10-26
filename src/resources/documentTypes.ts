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

type DocumentType = Schema<'DocumentType'>;
type DocumentTypeList = OperationResponse<'document_types_list'>;
type DocumentTypeCreateRequest = NonUndefined<OperationRequestBody<'document_types_create'>>;
type DocumentTypeUpdateRequest = NonUndefined<OperationRequestBody<'document_types_update'>>;
type DocumentTypePatchRequest = NonUndefined<OperationRequestBody<'document_types_partial_update'>>;

type DocumentTypeListQuery = OperationQuery<'document_types_list'>;
type DocumentTypePath = OperationPathParams<'document_types_retrieve'>;

/**
 * Client for interacting with the `/document_types` endpoints.
 */
export class DocumentTypesResource {
  /**
   * @param http Shared HTTP client used to perform API calls.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Returns a paginated list of document types.
   */
  list(query?: DocumentTypeListQuery): Promise<DocumentTypeList> {
    return this.http.get<DocumentTypeList>('/api/document_types/', { params: query });
  }

  /**
   * Fetches all document types without pagination.
   */
  listAll(query?: DocumentTypeListQuery): Promise<DocumentType[]> {
    return this.http.listAll<DocumentType>({
      method: 'GET',
      url: '/api/document_types/',
      params: query,
    });
  }

  /**
   * Retrieves a single document type by id.
   */
  retrieve(id: DocumentTypePath['id']): Promise<DocumentType> {
    const url = buildPath('/api/document_types/{id}/', { id });
    return this.http.get<DocumentType>(url);
  }

  /**
   * Creates a new document type.
   */
  create(body: DocumentTypeCreateRequest): Promise<DocumentType> {
    return this.http.post<DocumentType, DocumentTypeCreateRequest>('/api/document_types/', body);
  }

  /**
   * Replaces a document type with the provided payload.
   */
  update(id: DocumentTypePath['id'], body: DocumentTypeUpdateRequest): Promise<DocumentType> {
    const url = buildPath('/api/document_types/{id}/', { id });
    return this.http.put<DocumentType, DocumentTypeUpdateRequest>(url, body);
  }

  /**
   * Applies a partial update to an existing document type.
   */
  partialUpdate(id: DocumentTypePath['id'], body: DocumentTypePatchRequest): Promise<DocumentType> {
    const url = buildPath('/api/document_types/{id}/', { id });
    return this.http.patch<DocumentType, DocumentTypePatchRequest>(url, body);
  }

  /**
   * Deletes the specified document type.
   */
  remove(id: DocumentTypePath['id']): Promise<void> {
    const url = buildPath('/api/document_types/{id}/', { id });
    return this.http.delete<void>(url);
  }
}
