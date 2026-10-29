import { expectGetOneResponseStatus } from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareAndCreateCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe(
  'Verify comments DELETE operations',
  {
    tag: ['@CRUD', '@comments', '@DELETE'],
  },
  () => {
    let articleId: number;
    let commentId: number;

    test.beforeAll('create an article', async ({ articlesRequestLoggedIn }) => {
      const responseArticle = await createArticleWithApi(
        articlesRequestLoggedIn,
      );

      const article = await responseArticle.json();
      articleId = article.id;
    });

    test.beforeEach('create a comment', async ({ commentsRequestLoggedIn }) => {
      const responseComment = await prepareAndCreateCommentWithApi(
        commentsRequestLoggedIn,
        articleId,
      );
      const commentJson = await responseComment.json();
      commentId = commentJson.id;
    });

    test(
      'should delete a comment with a logged-in user',
      {
        tag: ['@GAD-R09-04'],
      },
      async ({ commentsRequestLoggedIn }) => {
        // Arrange
        const expectedStatusCodeDelete = 200;
        const expectedStatusCodeGet = 404;

        // Act
        const responseCommentDelete =
          await commentsRequestLoggedIn.delete(commentId);

        // Assert DELETE
        const actualResponseStatusDelete = responseCommentDelete.status();
        expect(
          actualResponseStatusDelete,
          `expected status code: ${expectedStatusCodeDelete}, received: ${actualResponseStatusDelete}`,
        ).toBe(expectedStatusCodeDelete);

        // Assert GET
        await expectGetOneResponseStatus(
          commentsRequestLoggedIn,
          commentId,
          expectedStatusCodeGet,
        );
      },
    );

    test(
      'should not delete a comment with a non logged-in user',
      {
        tag: ['@GAD-R09-04'],
      },
      async ({ commentsRequest }) => {
        // Arrange
        const expectedStatusCodeDelete = 401;
        const expectedStatusCodeGet = 200;

        // Assert DELETE
        const responseCommentDelete = await commentsRequest.delete(commentId);

        // Assert DELETE
        const actualResponseStatusDelete = responseCommentDelete.status();
        expect(
          actualResponseStatusDelete,
          `expected status code: ${expectedStatusCodeDelete}, received: ${actualResponseStatusDelete}`,
        ).toBe(expectedStatusCodeDelete);

        // Assert GET
        await expectGetOneResponseStatus(
          commentsRequest,
          commentId,
          expectedStatusCodeGet,
        );
      },
    );
  },
);
