import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment-payload.api.model';
import { Headers } from '@_src/api/models/header.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect } from '@_src/ui/fixtures/merge.fixture';
import { APIRequestContext, APIResponse } from '@playwright/test';

export async function createCommentWithApi(
  request: APIRequestContext,
  headers: Headers,
  articleId: number,
  commentData?: CommentPayload,
): Promise<APIResponse> {
  const commentDataFinal = commentData || prepareCommentPayload(articleId);
  const responseComment = await request.post(apiUrls.commentsUrl, {
    headers,
    data: commentDataFinal,
  });

  const commentJson = await responseComment.json();
  const expectedStatusCode = 200;

  await expect(async () => {
    const responseCommentCreated = await request.get(
      `${apiUrls.commentsUrl}/${commentJson.id}`,
    );
    expect(
      responseCommentCreated.status(),
      `Expected status: ${expectedStatusCode}, observed: ${responseCommentCreated.status()}`,
    ).toBe(expectedStatusCode);
  }).toPass({ timeout: 3_000 });

  return responseComment;
}
