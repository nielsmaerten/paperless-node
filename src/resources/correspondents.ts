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

/**
 * Client for interacting with the `/correspondents` endpoints.
 */
export class CorrespondentsResource {
  /**
   * @param http Shared HTTP client used to perform API calls.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Returns a paginated list of correspondents.
   */
  list(query?: CorrespondentListQuery): Promise<CorrespondentList> {
    return this.http.get<CorrespondentList>('/api/correspondents/', { params: query });
  }

  /**
   * Fetches every correspondent by traversing pagination.
   */
  listAll(query?: CorrespondentListQuery): Promise<Correspondent[]> {
    return this.http.listAll<Correspondent>({
      method: 'GET',
      url: '/api/correspondents/',
      params: query,
    });
  }

  /**
   * Retrieves a single correspondent by id.
   */
  retrieve(id: CorrespondentPath['id']): Promise<Correspondent> {
    const url = buildPath('/api/correspondents/{id}/', { id });
    return this.http.get<Correspondent>(url);
  }

  /**
   * Creates a new correspondent.
   */
  create(body: CorrespondentCreateRequest): Promise<Correspondent> {
    return this.http.post<Correspondent, CorrespondentCreateRequest>('/api/correspondents/', body);
  }

  /**
   * Replaces a correspondent with the supplied values.
   */
  update(id: CorrespondentPath['id'], body: CorrespondentUpdateRequest): Promise<Correspondent> {
    const url = buildPath('/api/correspondents/{id}/', { id });
    return this.http.put<Correspondent, CorrespondentUpdateRequest>(url, body);
  }

  /**
   * Applies a partial update to a correspondent.
   */
  partialUpdate(id: CorrespondentPath['id'], body: CorrespondentPatchRequest): Promise<Correspondent> {
    const url = buildPath('/api/correspondents/{id}/', { id });
    return this.http.patch<Correspondent, CorrespondentPatchRequest>(url, body);
  }

  /**
   * Deletes the specified correspondent.
   */
  remove(id: CorrespondentPath['id']): Promise<void> {
    const url = buildPath('/api/correspondents/{id}/', { id });
    return this.http.delete<void>(url);
  }
}
