import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe(
  'Verify articles CRUD operations',
  {
    tag: ['@GAD-R09-01', '@api'],
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
  },
);
