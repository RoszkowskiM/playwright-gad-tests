import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthHeader } from '@_src/api/factories/auth-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { Headers } from '@_src/api/models/header.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe(
  'Verify comments CREATE operations',
  {
    tag: ['@CRUD', '@comments', '@CREATE'],
  },
  () => {
    let articleId: number;
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

    test(
      'should create a comment with a logged-in user',
      {
        tag: ['@GAD-R09-02'],
      },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 201;

        // Act
        const commentData = prepareCommentPayload(articleId);
        const responseComment = await createCommentWithApi(
          request,
          headers,
          articleId,
          commentData,
        );

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
  },
);
