import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe(
  'Verify articles CREATE operations',
  {
    tag: ['@CRUD', '@articles', '@CREATE'],
  },
  () => {
    test('should not create an article without a logged-in user', async ({
      articlesRequest,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const articleData = prepareArticlePayload();

      // Act
      const response = await articlesRequest.post(articleData);

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    });

    test.describe('CREATE operations', () => {
      test(
        'should create an article with a logged-in user',
        {
          tag: ['@GAD-R09-01'],
        },
        async ({ articlesRequestLoggedIn }) => {
          // Arrange
          const expectedStatusCode = 201;

          // Act
          const articleData = prepareArticlePayload();
          const responseArticle = await createArticleWithApi(
            articlesRequestLoggedIn,
            articleData,
          );

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

      test(
        'should create new article with a logged-in user when modified article id does not exist',
        {
          tag: ['@GAD-R10-01'],
        },
        async ({ articlesRequestLoggedIn }) => {
          // Arrange
          const expectedStatusCodePut = 201;
          const articleData = prepareArticlePayload();

          // Act
          const responseArticlePut =
            await articlesRequestLoggedIn.putWithNonExistingArticleId(
              articleData,
            );

          // Assert PUT
          const actualResponseStatus = responseArticlePut.status();
          expect(
            actualResponseStatus,
            `expected status code: ${expectedStatusCodePut}, received: ${actualResponseStatus}`,
          ).toBe(expectedStatusCodePut);

          const articleJson = await responseArticlePut.json();
          expect.soft(articleJson.title).toEqual(articleData.title);
          expect.soft(articleJson.body).toEqual(articleData.body);
        },
      );
    });
  },
);
