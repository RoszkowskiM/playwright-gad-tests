import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { test } from '@_src/merge.fixture';
import { APIResponse, expect } from '@playwright/test';

test.describe(
  'Verify articles MODIFY operations',
  {
    tag: ['@CRUD', '@articles', '@UPDATE'],
  },
  () => {
    let articleData: ArticlePayload;
    let responseArticle: APIResponse;

    test.beforeEach(
      'create an article',
      async ({ articlesRequestLoggedIn }) => {
        articleData = prepareArticlePayload();
        responseArticle = await createArticleWithApi(
          articlesRequestLoggedIn,
          articleData,
        );
      },
    );

    test.describe(
      'fully modify article',
      {
        tag: ['@PUT'],
      },
      () => {
        test(
          'should modify and replace content for an article with a logged-in user',
          {
            tag: ['@GAD-R10-01'],
          },
          async ({ articlesRequestLoggedIn }) => {
            // Arrange
            const expectedStatusCodePut = 200;
            const articleJson = await responseArticle.json();
            const articleId = articleJson.id;
            const modifiedArticleData = prepareArticlePayload();

            // Act
            const responseArticlePut = await articlesRequestLoggedIn.put(
              articleId,
              modifiedArticleData,
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
            expect
              .soft(modifiedArticleJson.body)
              .toEqual(modifiedArticleData.body);
            expect
              .soft(modifiedArticleJson.title)
              .not.toEqual(articleData.title);
            expect.soft(modifiedArticleJson.body).not.toEqual(articleData.body);
          },
        );

        test(
          'should not modify an article with a non logged-in user',
          {
            tag: ['@GAD-R10-01'],
          },
          async ({ articlesRequest }) => {
            // Arrange
            const expectedStatusCodePut = 401;
            const articleJson = await responseArticle.json();
            const articleId = articleJson.id;
            const modifiedArticleData = prepareArticlePayload();

            // Act
            const responseArticlePut = await articlesRequest.put(
              articleId,
              modifiedArticleData,
            );

            // Assert PUT
            const actualResponseStatus = responseArticlePut.status();
            expect(
              actualResponseStatus,
              `expected status code: ${expectedStatusCodePut}, received: ${actualResponseStatus}`,
            ).toBe(expectedStatusCodePut);

            // Assert GET
            const nonModifiedArticle = await articlesRequest.getOne(articleId);

            const nonModifiedArticleJson = await nonModifiedArticle.json();

            expect
              .soft(nonModifiedArticleJson.title)
              .not.toEqual(modifiedArticleData.title);
            expect
              .soft(nonModifiedArticleJson.body)
              .not.toEqual(modifiedArticleData.body);
            expect
              .soft(nonModifiedArticleJson.title)
              .toEqual(articleData.title);
            expect.soft(nonModifiedArticleJson.body).toEqual(articleData.body);
          },
        );
      },
    );

    test.describe(
      'partially modify article',
      {
        tag: ['@PATCH'],
      },
      () => {
        test(
          'should partially update content for an article with a logged-in user',
          {
            tag: ['@GAD-R10-03'],
          },
          async ({ articlesRequestLoggedIn }) => {
            // Arrange
            const expectedStatusCodePatch = 200;
            const articleJson = await responseArticle.json();
            const articleId = articleJson.id;
            const modifiedArticleData = {
              title: `Patched article title ${new Date().toISOString()}`,
            };

            // Act
            const responseArticlePatch = await articlesRequestLoggedIn.patch(
              articleId,
              modifiedArticleData,
            );
            // Assert PATCH
            const actualResponseStatus = responseArticlePatch.status();
            expect(
              actualResponseStatus,
              `expected status code: ${expectedStatusCodePatch}, received: ${actualResponseStatus}`,
            ).toBe(expectedStatusCodePatch);

            const modifiedArticleJson = await responseArticlePatch.json();
            expect
              .soft(modifiedArticleJson.title)
              .toEqual(modifiedArticleData.title);
            expect
              .soft(modifiedArticleJson.title)
              .not.toEqual(articleData.title);
            expect.soft(modifiedArticleJson.body).toEqual(articleData.body);
          },
        );

        test(
          'should not partially modify an article with a non logged-in user',
          {
            tag: ['@GAD-R10-03'],
          },
          async ({ articlesRequest }) => {
            // Arrange
            const expectedStatusCodePatch = 401;
            const articleJson = await responseArticle.json();
            const articleId = articleJson.id;
            const modifiedArticleData = {
              title: `Patched article title ${new Date().toISOString()}`,
            };

            // Act
            const responseArticlePatch = await articlesRequest.patch(
              articleId,
              modifiedArticleData,
            );

            // Assert PATCH
            const actualResponseStatus = responseArticlePatch.status();
            expect(
              actualResponseStatus,
              `expected status code: ${expectedStatusCodePatch}, received: ${actualResponseStatus}`,
            ).toBe(expectedStatusCodePatch);

            // Assert GET
            const nonModifiedArticle = await articlesRequest.getOne(articleId);

            const nonModifiedArticleJson = await nonModifiedArticle.json();

            expect
              .soft(nonModifiedArticleJson.title)
              .not.toEqual(modifiedArticleData.title);
            expect
              .soft(nonModifiedArticleJson.title)
              .toEqual(articleData.title);
            expect.soft(nonModifiedArticleJson.body).toEqual(articleData.body);
          },
        );

        test(
          'should not partially modify an article with improper field with a logged-in user',
          {
            tag: ['@GAD-R10-03'],
          },
          async ({ articlesRequestLoggedIn }) => {
            // Arrange
            const expectedStatusCodePatch = 422;
            const articleJson = await responseArticle.json();
            const articleId = articleJson.id;
            const nonExistingField = `nonExistingField`;

            const expectedErrorMessage =
              `One of field is invalid (empty, invalid or too long) or there are some additional fields:` +
              ` Field validation: "${nonExistingField}" not in [id,user_id,title,body,date,image]`;

            const modifiedArticleData: Record<string, string> = {};
            modifiedArticleData[nonExistingField] = 'Hello';

            // Act
            const responseArticlePatch = await articlesRequestLoggedIn.patch(
              articleId,
              modifiedArticleData,
            );

            // Assert PATCH
            const actualResponseStatus = responseArticlePatch.status();
            expect(
              actualResponseStatus,
              `expected status code: ${expectedStatusCodePatch}, received: ${actualResponseStatus}`,
            ).toBe(expectedStatusCodePatch);

            const responseJson = await responseArticlePatch.json();

            expect
              .soft(responseJson.error.message)
              .toEqual(expectedErrorMessage);
          },
        );
      },
    );
  },
);
