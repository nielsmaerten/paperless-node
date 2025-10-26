import { HttpClient } from '../core/httpClient.js';
import type { NonUndefined, OperationRequestBody, OperationResponse, Schema } from '../core/types.js';

type TokenRequest = NonUndefined<OperationRequestBody<'token_create'>>;
type TokenResponse = OperationResponse<'token_create'>;
type ProfileTokenResponse = OperationResponse<'profile_generate_auth_token_create'>;

/**
 * Client for authentication-related endpoints.
 */
export class AuthResource {
  /**
   * @param http Shared HTTP client used to perform API calls.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Exchanges credentials for a Paperless access token.
   */
  login(body: TokenRequest): Promise<TokenResponse> {
    return this.http.post<TokenResponse, TokenRequest>('/api/token/', body);
  }

  /**
   * Generates a new profile token for use in the Paperless web UI.
   */
  regenerateProfileToken(): Promise<ProfileTokenResponse> {
    return this.http.post<ProfileTokenResponse>('/api/profile/generate_auth_token/');
  }
}
