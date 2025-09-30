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

type Correspondent = Schema<'Correspondent'>;
type CorrespondentList = OperationResponse<'correspondents_list'>;
type CorrespondentCreateRequest = NonUndefined<OperationRequestBody<'correspondents_create'>>;
type CorrespondentUpdateRequest = NonUndefined<OperationRequestBody<'correspondents_update'>>;
type CorrespondentPatchRequest = NonUndefined<OperationRequestBody<'correspondents_partial_update'>>;

type CorrespondentListQuery = OperationQuery<'correspondents_list'>;
type CorrespondentPath = OperationPathParams<'correspondents_retrieve'>;

export class CorrespondentsResource {
  constructor(private readonly http: HttpClient) {}

  list(query?: CorrespondentListQuery): Promise<CorrespondentList> {
    return this.http.get<CorrespondentList>('/api/correspondents/', { params: query });
  }

  listAll(query?: CorrespondentListQuery): Promise<Correspondent[]> {
    return this.http.listAll<Correspondent>({
      method: 'GET',
      url: '/api/correspondents/',
      params: query,
    });
  }

  retrieve(id: CorrespondentPath['id']): Promise<Correspondent> {
    const url = buildPath('/api/correspondents/{id}/', { id });
    return this.http.get<Correspondent>(url);
  }

  create(body: CorrespondentCreateRequest): Promise<Correspondent> {
    return this.http.post<Correspondent, CorrespondentCreateRequest>('/api/correspondents/', body);
  }

  update(id: CorrespondentPath['id'], body: CorrespondentUpdateRequest): Promise<Correspondent> {
    const url = buildPath('/api/correspondents/{id}/', { id });
    return this.http.put<Correspondent, CorrespondentUpdateRequest>(url, body);
  }

  partialUpdate(id: CorrespondentPath['id'], body: CorrespondentPatchRequest): Promise<Correspondent> {
    const url = buildPath('/api/correspondents/{id}/', { id });
    return this.http.patch<Correspondent, CorrespondentPatchRequest>(url, body);
  }

  remove(id: CorrespondentPath['id']): Promise<void> {
    const url = buildPath('/api/correspondents/{id}/', { id });
    return this.http.delete<void>(url);
  }
}
