import { expectGetResponseStatus } from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { test } from '@_src/merge.fixture';
import { APIResponse, expect } from '@playwright/test';

test.describe(
  'Verify articles DELETE operations',
  {
    tag: ['@CRUD', '@articles', '@DELETE'],
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

    test(
      'should delete an article with a logged-in user',
      {
        tag: ['@GAD-R09-03'],
      },
      async ({ articlesRequestLoggedIn }) => {
        // Arrange
        const expectedStatusCodeDelete = 200;
        const expectedStatusCodeGet = 404;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;

        // Act
        const responseArticleDelete =
          await articlesRequestLoggedIn.delete(articleId);

        // Assert DELETE
        const actualResponseStatusDelete = responseArticleDelete.status();
        expect(
          actualResponseStatusDelete,
          `expected status code: ${expectedStatusCodeDelete}, received: ${actualResponseStatusDelete}`,
        ).toBe(expectedStatusCodeDelete);

        // Assert GET
        const responseArticleGet =
          await articlesRequestLoggedIn.getOneArticle(articleId);
        const actualResponseStatusGet = responseArticleGet.status();
        expect(
          actualResponseStatusGet,
          `expected status code: ${expectedStatusCodeGet}, received: ${actualResponseStatusGet}`,
        ).toBe(expectedStatusCodeGet);
      },
    );

    test(
      'should not delete an article with a non logged-in user',
      {
        tag: ['@GAD-R09-03'],
      },
      async ({ request, articlesRequest }) => {
        // Arrange
        const expectedStatusCodeDelete = 401;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;

        // Act
        const responseArticleDelete = await articlesRequest.delete(articleId);

        // Assert DELETE
        const actualResponseStatusDelete = responseArticleDelete.status();
        expect(
          actualResponseStatusDelete,
          `expected status code: ${expectedStatusCodeDelete}, received: ${actualResponseStatusDelete}`,
        ).toBe(expectedStatusCodeDelete);

        // Assert GET
        const expectedNotDeletedArticleStatusCode = 200;
        await expectGetResponseStatus(
          request,
          `${apiUrls.articlesUrl}/${articleId}`,
          expectedNotDeletedArticleStatusCode,
        );
      },
    );
  },
);
