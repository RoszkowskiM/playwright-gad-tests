import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthHeader } from '@_src/api/factories/auth-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment-payload.api.model';
import { Headers } from '@_src/api/models/header.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe(
  'Verify comments UPDATE operations',
  {
    tag: ['@CRUD', '@comments', '@UPDATE'],
  },
  () => {
    let articleId: number;
    let commentId: number;
    let headers: Headers;
    let commentData: CommentPayload;

    test.beforeAll('create an article', async ({ request }) => {
      // User login
      headers = await getAuthHeader(request);

      // Create article
      const responseArticle = await createArticleWithApi(request, headers);

      const article = await responseArticle.json();
      articleId = article.id;
    });

    test.beforeEach('create a comment', async ({ request }) => {
      commentData = prepareCommentPayload(articleId);
      const responseComment = await createCommentWithApi(
        request,
        headers,
        articleId,
        commentData,
      );
      const commentJson = await responseComment.json();
      commentId = commentJson.id;
    });

    test(
      'should modify and replace content for a comment fon a logged-in user',
      {
        tag: ['@GAD-R10-02'],
      },
      async ({ request }) => {
        // Arrange
        const expectedStatusCodePut = 200;
        const modifiedCommentData = prepareCommentPayload(articleId);

        // Act
        const responseCommentPut = await request.put(
          `${apiUrls.commentsUrl}/${commentId}`,
          {
            headers,
            data: modifiedCommentData,
          },
        );

        // Assert PUT
        const actualResponseStatus = responseCommentPut.status();
        expect(
          actualResponseStatus,
          `expected status code: ${expectedStatusCodePut}, received: ${actualResponseStatus}`,
        ).toBe(expectedStatusCodePut);

        // Assert GET
        const modifiedCommentGet = await request.get(
          `${apiUrls.commentsUrl}/${commentId}`,
        );

        const modifiedCommentJson = await modifiedCommentGet.json();
        expect.soft(modifiedCommentJson.body).toEqual(modifiedCommentData.body);
        expect.soft(modifiedCommentJson.body).not.toEqual(commentData.body);
      },
    );

    test(
      'should not modify a comment with a non logged-in user',
      {
        tag: ['@GAD-R10-02'],
      },
      async ({ request }) => {
        // Arrange
        const expectedStatusCodePut = 401;
        const modifiedCommentData = prepareCommentPayload(articleId);

        // Act
        const responseCommentPut = await request.put(
          `${apiUrls.commentsUrl}/${commentId}`,
          {
            data: modifiedCommentData,
          },
        );

        // Assert PUT
        const actualResponseStatus = responseCommentPut.status();
        expect(
          actualResponseStatus,
          `expected status code: ${expectedStatusCodePut}, received: ${actualResponseStatus}`,
        ).toBe(expectedStatusCodePut);

        // Assert GET
        const nonModifiedComment = await request.get(
          `${apiUrls.commentsUrl}/${commentId}`,
        );

        const nonModifiedCommentJson = await nonModifiedComment.json();
        expect
          .soft(nonModifiedCommentJson.body)
          .not.toEqual(modifiedCommentData.body);
        expect.soft(nonModifiedCommentJson.body).toEqual(commentData.body);
      },
    );
  },
);
