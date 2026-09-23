import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  getAuthHeader,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.util';

test.describe(
  'Verify comments CRUD operations',
  {
    tag: ['@GAD-R09-02', '@CRUD'],
  },
  () => {
    let articleId: number;
    let headers: { [key: string]: string };

    test.beforeAll('create an article', async ({ request }) => {
      headers = await getAuthHeader(request);

      // Create article
      const articlesUrl = '/api/articles';
      const articleData = prepareArticlePayload();

      const response = await request.post(articlesUrl, {
        headers,
        data: articleData,
      });

      const article = await response.json();
      articleId = article.id;
    });

    test('should not create a comment without a logged-in user', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const commentsUrl = '/api/comments';
      const commentData = prepareCommentPayload(articleId);

      // Act
      const response = await request.post(commentsUrl, {
        data: commentData,
      });

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    });

    test('should create a comment with a logged-in user', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 201;
      const commentsUrl = '/api/comments';
      const commentData = prepareCommentPayload(articleId);

      // Act
      const response = await request.post(commentsUrl, {
        headers,
        data: commentData,
      });

      // Assert
      const actualResponseStatus = response.status();
      expect(
        actualResponseStatus,
        `expected status code: ${expectedStatusCode}, received: ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const comment = await response.json();
      expect.soft(comment.body).toEqual(commentData.body);
    });
  },
);
