import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthHeader } from '@_src/api/factories/auth-header.api.factory';
import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { Headers } from '@_src/api/models/header.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse, expect } from '@playwright/test';

test.describe(
  'Verify articles MODIFY operations',
  {
    tag: ['@CRUD', '@articles', '@PUT'],
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
      'should modify and replace content for an article with a logged-in user',
      {
        tag: ['@GAD-R10-01'],
      },
      async ({ request }) => {
        // Arrange
        const expectedStatusCodePut = 200;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;
        const modifiedArticleData = prepareArticlePayload();

        // Act
        const responseArticlePut = await request.put(
          `${apiUrls.articlesUrl}/${articleId}`,
          {
            headers,
            data: modifiedArticleData,
          },
        );
        // Assert PUT
        const actualResponseStatus = responseArticlePut.status();
        expect(
          actualResponseStatus,
          `expected status code: ${expectedStatusCodePut}, received: ${actualResponseStatus}`,
        ).toBe(expectedStatusCodePut);

        const modifiedArticleJson = await responseArticlePut.json();
        expect
          .soft(modifiedArticleJson.title)
          .toEqual(modifiedArticleData.title);
        expect.soft(modifiedArticleJson.body).toEqual(modifiedArticleData.body);
        expect.soft(modifiedArticleJson.title).not.toEqual(articleData.title);
        expect.soft(modifiedArticleJson.body).not.toEqual(articleData.body);
      },
    );

    test(
      'should not modify an article with a non logged-in user',
      {
        tag: ['@GAD-R10-01'],
      },
      async ({ request }) => {
        // Arrange
        const expectedStatusCodePut = 401;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;
        const modifiedArticleData = prepareArticlePayload();

        // Act
        const responseArticlePut = await request.put(
          `${apiUrls.articlesUrl}/${articleId}`,
          {
            data: modifiedArticleData,
          },
        );

        // Assert PUT
        const actualResponseStatus = responseArticlePut.status();
        expect(
          actualResponseStatus,
          `expected status code: ${expectedStatusCodePut}, received: ${actualResponseStatus}`,
        ).toBe(expectedStatusCodePut);

        const nonModifiedArticle = await request.get(
          `${apiUrls.articlesUrl}/${articleId}`,
        );

        const nonModifiedArticleJson = await nonModifiedArticle.json();

        expect
          .soft(nonModifiedArticleJson.title)
          .not.toEqual(modifiedArticleData.title);
        expect
          .soft(nonModifiedArticleJson.body)
          .not.toEqual(modifiedArticleData.body);
        expect.soft(nonModifiedArticleJson.title).toEqual(articleData.title);
        expect.soft(nonModifiedArticleJson.body).toEqual(articleData.body);
      },
    );
  },
);
