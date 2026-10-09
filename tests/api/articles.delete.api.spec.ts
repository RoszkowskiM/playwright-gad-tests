/* eslint-disable playwright/expect-expect */
import {
  expectDeleteResponseStatus,
  expectGetResponseStatus,
} from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthHeader } from '@_src/api/factories/auth-header.api.factory';
import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { Headers } from '@_src/api/models/header.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify articles DELETE operations',
  {
    tag: ['@CRUD', '@articles', '@DELETE'],
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

        // Assert DELETE
        await expectDeleteResponseStatus(
          request,
          `${apiUrls.articlesUrl}/${articleId}`,
          expectedStatusCodeDelete,
          headers,
        );

        // Assert GET
        await expectGetResponseStatus(
          request,
          `${apiUrls.articlesUrl}/${articleId}`,
          expectedStatusCodeGet,
        );
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

        // Assert DELETE
        await expectDeleteResponseStatus(
          request,
          `${apiUrls.articlesUrl}/${articleId}`,
          expectedStatusCodeDelete,
        );

        // Assert GET
        await expectGetResponseStatus(
          request,
          `${apiUrls.articlesUrl}/${articleId}`,
          expectedStatusCodeGet,
        );
      },
    );
  },
);
