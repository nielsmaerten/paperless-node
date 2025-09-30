import { HttpClient } from '../core/httpClient.js';
import type { NonUndefined, OperationRequestBody, OperationResponse, Schema } from '../core/types.js';

type TokenRequest = NonUndefined<OperationRequestBody<'token_create'>>;
type TokenResponse = OperationResponse<'token_create'>;
type ProfileTokenResponse = OperationResponse<'profile_generate_auth_token_create'>;

export class AuthResource {
  constructor(private readonly http: HttpClient) {}

  login(body: TokenRequest): Promise<TokenResponse> {
    return this.http.post<TokenResponse, TokenRequest>('/api/token/', body);
  }

  regenerateProfileToken(): Promise<ProfileTokenResponse> {
    return this.http.post<ProfileTokenResponse>('/api/profile/generate_auth_token/');
  }
}
