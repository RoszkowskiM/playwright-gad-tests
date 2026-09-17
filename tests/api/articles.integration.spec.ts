import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user.data';

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

    test('should create an article with a logged-in user', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 201;

      // Login
      const loginUrl = '/api/login';
      const userData = {
        email: testUser1.userEmail,
        password: testUser1.userPassword,
      };

      const responseLogin = await request.post(loginUrl, {
        data: userData,
      });
      const responseLoginJson = await responseLogin.json();

      const articlesUrl = '/api/articles';

      const randomArticleData = prepareRandomArticle();
      const articleData = {
        title: randomArticleData.title,
        body: randomArticleData.body,
        date: '2026-09-16T07:18:47.823Z',
        image: '.\\data\\images\\256\\andrew-svk-nQvFebPtqbw-unsplash.jpg',
      };

      // Act
      const headers = {
        Authorization: `Bearer ${responseLoginJson.access_token}`,
      };
      const response = await request.post(articlesUrl, {
        headers,
        data: articleData,
      });

      // Assert
      const actualResponseStatus = response.status();
      expect(
        actualResponseStatus,
        `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const article = await response.json();
      expect.soft(article.title).toEqual(articleData.title);
      expect.soft(article.body).toEqual(articleData.body);
    });
  },
);
