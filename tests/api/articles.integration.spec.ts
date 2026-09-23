import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { getAuthHeader } from '@_src/utils/api.util';

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
      const articlesUrl = '/api/articles';

      const randomArticleData = prepareRandomArticle();
      const articleData = {
        title: randomArticleData.title,
        body: randomArticleData.body,
        date: '2026-09-16T07:18:47.823Z',
        image: 'image_string',
      };

      // Act
      const response = await request.post(articlesUrl, {
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

      // Act
      const articlesUrl = '/api/articles';

      const randomArticleData = prepareRandomArticle();
      const articleData = {
        title: randomArticleData.title,
        body: randomArticleData.body,
        date: '2026-09-16T07:18:47.823Z',
        image: '.\\data\\images\\256\\andrew-svk-nQvFebPtqbw-unsplash.jpg',
      };

      const response = await request.post(articlesUrl, {
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
