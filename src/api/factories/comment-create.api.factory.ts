import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment-payload.api.model';
import { CommentsRequest } from '@_src/api/requests/comments.request';
import { expect } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

export async function prepareAndCreateCommentWithApi(
  commentsRequest: CommentsRequest,
  articleId: number,
): Promise<APIResponse> {
  const commentData = prepareCommentPayload(articleId);

  return await createCommentWithApi(commentsRequest, commentData);
}

export async function createCommentWithApi(
  commentsRequest: CommentsRequest,
  commentData: CommentPayload,
): Promise<APIResponse> {
  const responseComment = await commentsRequest.post(commentData);

  const commentJson = await responseComment.json();
  const expectedStatusCode = 200;

  await expect(async () => {
    const responseCommentCreated = await commentsRequest.getOneComment(
      commentJson.id,
    );
    expect(
      responseCommentCreated.status(),
      `Expected status: ${expectedStatusCode}, observed: ${responseCommentCreated.status()}`,
    ).toBe(expectedStatusCode);
  }).toPass({ timeout: 3_000 });

  return responseComment;
}
