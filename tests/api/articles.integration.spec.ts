import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  ArticlePayload,
  Headers,
  apiLinks,
  getAuthHeader,
  prepareArticlePayload,
} from '@_src/utils/api.util';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify articles CRUD operations',
  {
    tag: ['@GAD-R09-03', '@CRUD'],
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

    test.describe(
      'CRUD operations',
      {
        tag: ['@GAD-R09-03', '@CRUD'],
      },
      () => {
        let articleData: ArticlePayload;
        let headers: Headers;
        let responseArticle: APIResponse;

        test.beforeAll('user login', async ({ request }) => {
          headers = await getAuthHeader(request);
        });

        test.beforeEach('create an article', async ({ request }) => {
          // Arrange
          articleData = prepareArticlePayload();

          // Act
          responseArticle = await request.post(apiLinks.articlesUrl, {
            headers,
            data: articleData,
          });
        });

        test('should create an article with a logged-in user', async ({}) => {
          // Arrange
          const expectedStatusCode = 201;

          // Assert
          const actualResponseStatus = responseArticle.status();
          expect(
            actualResponseStatus,
            `expected status code: ${expectedStatusCode}, received: ${actualResponseStatus}`,
          ).toBe(expectedStatusCode);

          const articleJson = await responseArticle.json();
          expect.soft(articleJson.title).toEqual(articleData.title);
          expect.soft(articleJson.body).toEqual(articleData.body);
        });

        test('should delete an article with a logged-in user', async ({
          request,
        }) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Arrange
          const expectedStatusCodeDelete = 200;
          const expectedStatusCodeGet = 404;
          const articleJson = await responseArticle.json();
          const articleId = articleJson.id;

          // Act
          const responseArticleDelete = await request.delete(
            `${apiLinks.articlesUrl}/${articleId}`,
            {
              headers,
            },
          );

          const responseArticleGet = await request.get(
            `${apiLinks.articlesUrl}/${articleId}`,
          );

          // Assert DELETE
          const actualDeleteResponseStatus = responseArticleDelete.status();
          expect(
            actualDeleteResponseStatus,
            `expected status code: ${expectedStatusCodeDelete}, received: ${actualDeleteResponseStatus}`,
          ).toBe(expectedStatusCodeDelete);

          // Assert GET
          const actualGetResponseStatus = responseArticleGet.status();
          expect(
            actualGetResponseStatus,
            `expected status code: ${expectedStatusCodeGet}, received: ${actualGetResponseStatus}`,
          ).toBe(expectedStatusCodeGet);
        });

        test('should not delete an article with a non logged-in user', async ({
          request,
        }) => {
          // await new Promise((resolve) => setTimeout(resolve, 1000));

          // Arrange
          const expectedStatusCodeDelete = 401;
          const expectedStatusCodeGet = 200;
          const articleJson = await responseArticle.json();
          const articleId = articleJson.id;

          // Act
          const responseArticleDelete = await request.delete(
            `${apiLinks.articlesUrl}/${articleId}`,
          );

          const responseArticleGet = await request.get(
            `${apiLinks.articlesUrl}/${articleId}`,
          );

          // Assert DELETE
          const actualDeleteResponseStatus = responseArticleDelete.status();
          expect(
            actualDeleteResponseStatus,
            `expected status code: ${expectedStatusCodeDelete}, received: ${actualDeleteResponseStatus}`,
          ).toBe(expectedStatusCodeDelete);

          // Assert GET
          const actualGetResponseStatus = responseArticleGet.status();
          expect(
            actualGetResponseStatus,
            `expected status code: ${expectedStatusCodeGet}, received: ${actualGetResponseStatus}`,
          ).toBe(expectedStatusCodeGet);
        });
      },
    );
  },
);
