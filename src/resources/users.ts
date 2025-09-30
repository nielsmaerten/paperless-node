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

type User = Schema<'User'>;
type UserList = OperationResponse<'users_list'>;
type UserCreateRequest = NonUndefined<OperationRequestBody<'users_create'>>;
type UserUpdateRequest = NonUndefined<OperationRequestBody<'users_update'>>;
type UserPatchRequest = NonUndefined<OperationRequestBody<'users_partial_update'>>;

type UserListQuery = OperationQuery<'users_list'>;
type UserPath = OperationPathParams<'users_retrieve'>;

type DeactivateTotpBody = NonUndefined<OperationRequestBody<'users_deactivate_totp_create'>>;

type DeactivateTotpResponse = OperationResponse<'users_deactivate_totp_create'>;

export class UsersResource {
  constructor(private readonly http: HttpClient) {}

  list(query?: UserListQuery): Promise<UserList> {
    return this.http.get<UserList>('/api/users/', { params: query });
  }

  listAll(query?: UserListQuery): Promise<User[]> {
    return this.http.listAll<User>({
      method: 'GET',
      url: '/api/users/',
      params: query,
    });
  }

  retrieve(id: UserPath['id']): Promise<User> {
    const url = buildPath('/api/users/{id}/', { id });
    return this.http.get<User>(url);
  }

  create(body: UserCreateRequest): Promise<User> {
    return this.http.post<User, UserCreateRequest>('/api/users/', body);
  }

  update(id: UserPath['id'], body: UserUpdateRequest): Promise<User> {
    const url = buildPath('/api/users/{id}/', { id });
    return this.http.put<User, UserUpdateRequest>(url, body);
  }

  partialUpdate(id: UserPath['id'], body: UserPatchRequest): Promise<User> {
    const url = buildPath('/api/users/{id}/', { id });
    return this.http.patch<User, UserPatchRequest>(url, body);
  }

  remove(id: UserPath['id']): Promise<void> {
    const url = buildPath('/api/users/{id}/', { id });
    return this.http.delete<void>(url);
  }

  deactivateTotp(id: UserPath['id'], body: DeactivateTotpBody): Promise<DeactivateTotpResponse> {
    const url = buildPath('/api/users/{id}/deactivate_totp/', { id });
    return this.http.post<DeactivateTotpResponse, DeactivateTotpBody>(url, body);
  }
}
