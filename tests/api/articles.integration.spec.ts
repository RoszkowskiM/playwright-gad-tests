import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  apiLinks,
  getAuthHeader,
  prepareArticlePayload,
} from '@_src/utils/api.util';

test.describe(
  'Verify articles CRUD operations',
  {
    tag: ['@GAD-R09-01', '@CRUD'],
  },
  () => {
    test('should not create an article without a logged-in user', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const articleData = prepareArticlePayload();

      // Act
      const response = await request.post(apiLinks.articlesUrl, {
        data: articleData,
      });

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    });

    test('should create an article with a logged-in user', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 201;
      const headers = await getAuthHeader(request);
      const articleData = prepareArticlePayload();

      // Act
      const response = await request.post(apiLinks.articlesUrl, {
        headers,
        data: articleData,
      });

      // Assert
      const actualResponseStatus = response.status();
      expect(
        actualResponseStatus,
        `expected status code: ${expectedStatusCode}, received: ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const article = await response.json();
      expect.soft(article.title).toEqual(articleData.title);
      expect.soft(article.body).toEqual(articleData.body);
    });
  },
);
