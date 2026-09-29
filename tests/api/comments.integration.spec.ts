import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  CommentPayload,
  Headers,
  apiLinks,
  getAuthHeader,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.util';
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
      const articleData = prepareArticlePayload();

      const responseArticle = await request.post(apiLinks.articlesUrl, {
        headers,
        data: articleData,
      });

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
        const responseComment = await request.post(apiLinks.commentsUrl, {
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
          // Arrange
          commentData = prepareCommentPayload(articleId);

          // Act
          responseComment = await request.post(apiLinks.commentsUrl, {
            headers,
            data: commentData,
          });

          const comment = await responseComment.json();
          commentId = comment.id;
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

            // Act
            const responseCommentDelete = await request.delete(
              `${apiLinks.commentsUrl}/${commentId}`,
              {
                headers,
              },
            );

            const responseCommentGet = await request.get(
              `${apiLinks.commentsUrl}/${commentId}`,
            );

            // Assert DELETE
            const actualDeleteResponseStatus = responseCommentDelete.status();
            expect(
              actualDeleteResponseStatus,
              `expected status code: ${expectedStatusCodeDelete}, received: ${actualDeleteResponseStatus}`,
            ).toBe(expectedStatusCodeDelete);

            // Assert GET
            const actualGetResponseStatus = responseCommentGet.status();
            expect(
              actualGetResponseStatus,
              `expected status code: ${expectedStatusCodeGet}, received: ${actualGetResponseStatus}`,
            ).toBe(expectedStatusCodeGet);
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

            // Act
            const responseCommentDelete = await request.delete(
              `${apiLinks.commentsUrl}/${commentId}`,
            );

            const responseCommentGet = await request.get(
              `${apiLinks.commentsUrl}/${commentId}`,
            );

            // Assert DELETE
            const actualNotDeletedResponseStatus =
              responseCommentDelete.status();
            expect(
              actualNotDeletedResponseStatus,
              `expected status code: ${expectedStatusCodeDelete}, received: ${actualNotDeletedResponseStatus}`,
            ).toBe(expectedStatusCodeDelete);

            // Assert GET
            const actualGetResponseStatus = responseCommentGet.status();
            expect(
              actualGetResponseStatus,
              `expected status code: ${expectedStatusCodeGet}, received: ${actualGetResponseStatus}`,
            ).toBe(expectedStatusCodeGet);
          },
        );
      },
    );
  },
);
