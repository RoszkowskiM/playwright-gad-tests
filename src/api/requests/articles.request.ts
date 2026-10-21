import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { Headers } from '@_src/api/models/header.api.model';
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
  async post(headers: Headers, data: ArticlePayload): Promise<APIResponse> {
    return await this.request.post(this.url, {
      headers,
      data,
    });
  }
}
