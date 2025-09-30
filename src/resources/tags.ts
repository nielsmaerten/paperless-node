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

type Tag = Schema<'Tag'>;
type TagList = OperationResponse<'tags_list'>;
type TagRequest = NonUndefined<OperationRequestBody<'tags_create'>>;
type TagUpdateRequest = NonUndefined<OperationRequestBody<'tags_update'>>;
type TagPatchRequest = NonUndefined<OperationRequestBody<'tags_partial_update'>>;

type TagListQuery = OperationQuery<'tags_list'>;
type TagPath = OperationPathParams<'tags_retrieve'>;

export class TagsResource {
  constructor(private readonly http: HttpClient) {}

  list(query?: TagListQuery): Promise<TagList> {
    return this.http.get<TagList>('/api/tags/', { params: query });
  }

  listAll(query?: TagListQuery): Promise<Tag[]> {
    return this.http.listAll<Tag>({
      method: 'GET',
      url: '/api/tags/',
      params: query,
    });
  }

  retrieve(id: TagPath['id']): Promise<Tag> {
    const url = buildPath('/api/tags/{id}/', { id });
    return this.http.get<Tag>(url);
  }

  create(body: TagRequest): Promise<Tag> {
    return this.http.post<Tag, TagRequest>('/api/tags/', body);
  }

  update(id: TagPath['id'], body: TagUpdateRequest): Promise<Tag> {
    const url = buildPath('/api/tags/{id}/', { id });
    return this.http.put<Tag, TagUpdateRequest>(url, body);
  }

  partialUpdate(id: TagPath['id'], body: TagPatchRequest): Promise<Tag> {
    const url = buildPath('/api/tags/{id}/', { id });
    return this.http.patch<Tag, TagPatchRequest>(url, body);
  }

  remove(id: TagPath['id']): Promise<void> {
    const url = buildPath('/api/tags/{id}/', { id });
    return this.http.delete<void>(url);
  }
}
