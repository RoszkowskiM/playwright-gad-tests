import { apiUrls } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ArticlesRequest {
  url = apiUrls.articlesUrl;
  constructor(protected request: APIRequestContext) {}

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url);
  }

  async getOneArticle(articleId: string): Promise<APIResponse> {
    return await this.request.get(`${this.url}/${articleId}`);
  }
}
