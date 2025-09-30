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

export class DocumentTypesResource {
  constructor(private readonly http: HttpClient) {}

  list(query?: DocumentTypeListQuery): Promise<DocumentTypeList> {
    return this.http.get<DocumentTypeList>('/api/document_types/', { params: query });
  }

  listAll(query?: DocumentTypeListQuery): Promise<DocumentType[]> {
    return this.http.listAll<DocumentType>({
      method: 'GET',
      url: '/api/document_types/',
      params: query,
    });
  }

  retrieve(id: DocumentTypePath['id']): Promise<DocumentType> {
    const url = buildPath('/api/document_types/{id}/', { id });
    return this.http.get<DocumentType>(url);
  }

  create(body: DocumentTypeCreateRequest): Promise<DocumentType> {
    return this.http.post<DocumentType, DocumentTypeCreateRequest>('/api/document_types/', body);
  }

  update(id: DocumentTypePath['id'], body: DocumentTypeUpdateRequest): Promise<DocumentType> {
    const url = buildPath('/api/document_types/{id}/', { id });
    return this.http.put<DocumentType, DocumentTypeUpdateRequest>(url, body);
  }

  partialUpdate(id: DocumentTypePath['id'], body: DocumentTypePatchRequest): Promise<DocumentType> {
    const url = buildPath('/api/document_types/{id}/', { id });
    return this.http.patch<DocumentType, DocumentTypePatchRequest>(url, body);
  }

  remove(id: DocumentTypePath['id']): Promise<void> {
    const url = buildPath('/api/document_types/{id}/', { id });
    return this.http.delete<void>(url);
  }
}
