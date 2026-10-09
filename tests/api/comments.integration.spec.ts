/* eslint-disable playwright/expect-expect */
import {
  expectDeleteResponseStatus,
  expectGetResponseStatus,
} from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthHeader } from '@_src/api/factories/auth-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment-payload.api.model';
import { Headers } from '@_src/api/models/header.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comments CRUD operations',
  {
    tag: ['@CRUD'],
  },
  () => {
    let articleId: number;
    let commentId: number;
    let headers: Headers;

    test.beforeAll('create an article', async ({ request }) => {
      // User login
      headers = await getAuthHeader(request);

      // Create article
      const responseArticle = await createArticleWithApi(request, headers);

      const article = await responseArticle.json();
      articleId = article.id;
    });

    test(
      'should not create a comment without a logged-in user',
      {
        tag: ['@GAD-R09-02'],
      },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;
        const commentData = prepareCommentPayload(articleId);

        // Act
        const responseComment = await request.post(apiUrls.commentsUrl, {
          data: commentData,
        });

        // Assert
        expect(responseComment.status()).toBe(expectedStatusCode);
      },
    );

    test.describe(
      'CRUD operations',
      {
        tag: ['@CRUD'],
      },
      () => {
        let responseComment: APIResponse;
        let commentData: CommentPayload;

        test.beforeEach('create a comment', async ({ request }) => {
          commentData = prepareCommentPayload(articleId);
          responseComment = await createCommentWithApi(
            request,
            headers,
            articleId,
            commentData,
          );
          const commentJson = await responseComment.json();
          commentId = commentJson.id;
        });

        //--------------------------------POST--------------------------------//

        test(
          'should create a comment with a logged-in user',
          {
            tag: ['@GAD-R09-02'],
          },
          async () => {
            // Arrange
            const expectedStatusCode = 201;

            // Assert
            const actualResponseStatus = responseComment.status();
            expect(
              actualResponseStatus,
              `expected status code: ${expectedStatusCode}, received: ${actualResponseStatus}`,
            ).toBe(expectedStatusCode);

            const comment = await responseComment.json();
            expect.soft(comment.body).toEqual(commentData.body);
          },
        );

        //--------------------------------DELETE--------------------------------//

        test(
          'should delete a comment with a logged-in user',
          {
            tag: ['@GAD-R09-04'],
          },
          async ({ request }) => {
            // Arrange
            const expectedStatusCodeDelete = 200;
            const expectedStatusCodeGet = 404;

            // Assert DELETE
            await expectDeleteResponseStatus(
              request,
              `${apiUrls.commentsUrl}/${commentId}`,
              expectedStatusCodeDelete,
              headers,
            );

            // Assert GET
            await expectGetResponseStatus(
              request,
              `${apiUrls.commentsUrl}/${commentId}`,
              expectedStatusCodeGet,
            );
          },
        );

        test(
          'should not delete a comment with a non logged-in user',
          {
            tag: ['@GAD-R09-04'],
          },
          async ({ request }) => {
            // Arrange
            const expectedStatusCodeDelete = 401;
            const expectedStatusCodeGet = 200;

            // Assert DELETE
            await expectDeleteResponseStatus(
              request,
              `${apiUrls.commentsUrl}/${commentId}`,
              expectedStatusCodeDelete,
            );

            // Assert GET
            await expectGetResponseStatus(
              request,
              `${apiUrls.commentsUrl}/${commentId}`,
              expectedStatusCodeGet,
            );
          },
        );
      },
    );
  },
);
