import { CommentPayload } from '@_src/api/models/comment-payload.api.model';
import { Headers } from '@_src/api/models/header.api.model';
import { apiUrls, timestamp } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class CommentsRequest {
  url = apiUrls.commentsUrl;
  constructor(
    protected request: APIRequestContext,
    protected headers?: Headers,
  ) {}

  async get(): Promise<APIResponse> {
    return await this.request.get(this.url, {
      headers: this.headers,
    });
  }

  async getOneComment(commentId: number): Promise<APIResponse> {
    return await this.request.get(`${this.url}/${commentId}`, {
      headers: this.headers,
    });
  }

  async post(data: CommentPayload): Promise<APIResponse> {
    return await this.request.post(this.url, {
      headers: this.headers,
      data,
    });
  }

  async put(commentId: number, data: CommentPayload): Promise<APIResponse> {
    return await this.request.put(`${this.url}/${commentId}`, {
      headers: this.headers,
      data,
    });
  }

  async putWithNonExistingCommentId(
    data: CommentPayload,
  ): Promise<APIResponse> {
    const timeStamp = await timestamp();
    return await this.request.put(`${this.url}/${timeStamp}`, {
      headers: this.headers,
      data,
    });
  }

  async patch(
    commentId: number,
    data: Partial<CommentPayload>,
  ): Promise<APIResponse> {
    return await this.request.patch(`${this.url}/${commentId}`, {
      headers: this.headers,
      data,
    });
  }

  async delete(commentId: number): Promise<APIResponse> {
    return await this.request.delete(`${this.url}/${commentId}`, {
      headers: this.headers,
    });
  }
}
