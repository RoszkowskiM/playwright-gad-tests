import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ArticlesRequest {
  url = apiUrls.articlesUrl;
  constructor(protected request: APIRequestContext) {}

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url);
  }
  // async post(): Promise<void> {
  //   await this.request.post(this.url);
  // }
  // async put(): Promise<void> {
  //   await this.request.put(this.url);
  // }
  // async patch(): Promise<void> {
  //   await this.request.patch(this.url);
  // }
  // async delete(): Promise<void> {
  //   await this.request.delete(this.url);
  // }
}
