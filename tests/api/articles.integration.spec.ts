import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthHeader } from '@_src/api/factories/auth-header.api.factory';
import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { Headers } from '@_src/api/models/header.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify articles CRUD operations',
  {
    tag: ['@CRUD'],
  },
  () => {
    //--------------------------------POST--------------------------------//

    test('should not create an article without a logged-in user', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const articleData = prepareArticlePayload();

      // Act
      const response = await request.post(apiUrls.articlesUrl, {
        data: articleData,
      });

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    });

    test.describe(
      'CRUD operations',
      {
        tag: ['@CRUD'],
      },
      () => {
        let articleData: ArticlePayload;
        let headers: Headers;
        let responseArticle: APIResponse;

        test.beforeAll('user login', async ({ request }) => {
          headers = await getAuthHeader(request);
        });

        test.beforeEach('create an article', async ({ request }) => {
          articleData = prepareArticlePayload();
          responseArticle = await createArticleWithApi(
            request,
            headers,
            articleData,
          );
        });

        test(
          'should create an article with a logged-in user',
          {
            tag: ['@GAD-R09-01'],
          },
          async ({}) => {
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
          },
        );

        //--------------------------------DELETE--------------------------------//

        test(
          'should delete an article with a logged-in user',
          {
            tag: ['@GAD-R09-03'],
          },
          async ({ request }) => {
            // Arrange
            const expectedStatusCodeDelete = 200;
            const expectedStatusCodeGet = 404;
            const articleJson = await responseArticle.json();
            const articleId = articleJson.id;

            // Act
            const responseArticleDelete = await request.delete(
              `${apiUrls.articlesUrl}/${articleId}`,
              {
                headers,
              },
            );

            const responseArticleGet = await request.get(
              `${apiUrls.articlesUrl}/${articleId}`,
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
          },
        );

        test(
          'should not delete an article with a non logged-in user',
          {
            tag: ['@GAD-R09-03'],
          },
          async ({ request }) => {
            // Arrange
            const expectedStatusCodeDelete = 401;
            const expectedStatusCodeGet = 200;
            const articleJson = await responseArticle.json();
            const articleId = articleJson.id;

            // Act
            const responseArticleDelete = await request.delete(
              `${apiUrls.articlesUrl}/${articleId}`,
            );

            const responseArticleGet = await request.get(
              `${apiUrls.articlesUrl}/${articleId}`,
            );

            // Assert DELETE
            const actualNotDeletedResponseStatus =
              responseArticleDelete.status();
            expect(
              actualNotDeletedResponseStatus,
              `expected status code: ${expectedStatusCodeDelete}, received: ${actualNotDeletedResponseStatus}`,
            ).toBe(expectedStatusCodeDelete);

            // Assert GET
            const actualGetResponseStatus = responseArticleGet.status();
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
