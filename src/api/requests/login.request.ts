import { Headers } from '@_src/api/models/header.api.model';
import { LoginData } from '@_src/api/models/login.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class LoginRequest {
  url = apiUrls.loginUrl;
  constructor(
    protected request: APIRequestContext,
    protected headers?: Headers,
  ) {}

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url, {
      headers: this.headers,
    });
  }

  async post(data: LoginData): Promise<APIResponse> {
    return await this.request.post(this.url, {
      headers: this.headers,
      data,
    });
  }
}
