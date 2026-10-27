import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { Headers } from '@_src/api/models/header.api.model';
import { apiUrls, timestamp } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ArticlesRequest {
  url = apiUrls.articlesUrl;
  constructor(
    protected request: APIRequestContext,
    protected headers?: Headers,
  ) {}

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url, {
      headers: this.headers,
    });
  }

  async getOneArticle(articleId: string): Promise<APIResponse> {
    return await this.request.get(`${this.url}/${articleId}`, {
      headers: this.headers,
    });
  }

  async post(data: ArticlePayload): Promise<APIResponse> {
    return await this.request.post(this.url, {
      headers: this.headers,
      data,
    });
  }

  async put(articleId: string, data: ArticlePayload): Promise<APIResponse> {
    return await this.request.put(`${this.url}/${articleId}`, {
      headers: this.headers,
      data,
    });
  }

  async putWithNonExistingArticleId(
    data: ArticlePayload,
  ): Promise<APIResponse> {
    const timeStamp = await timestamp();
    return await this.request.put(`${this.url}/${timeStamp}`, {
      headers: this.headers,
      data,
    });
  }

  async patch(
    articleId: string,
    data: Partial<ArticlePayload>,
  ): Promise<APIResponse> {
    return await this.request.patch(`${this.url}/${articleId}`, {
      headers: this.headers,
      data,
    });
  }

  async delete(articleId: string): Promise<APIResponse> {
    return await this.request.delete(`${this.url}/${articleId}`, {
      headers: this.headers,
    });
  }
}
