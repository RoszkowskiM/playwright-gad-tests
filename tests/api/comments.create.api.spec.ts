import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { expect, test } from '@_src/merge.fixture';

test.describe(
  'Verify comments CREATE operations',
  {
    tag: ['@CRUD', '@comments', '@CREATE'],
  },
  () => {
    let articleId: number;

    test.beforeAll('create an article', async ({ articlesRequestLoggedIn }) => {
      const responseArticle = await createArticleWithApi(
        articlesRequestLoggedIn,
      );

      const article = await responseArticle.json();
      articleId = article.id;
    });

    test(
      'should not create a comment without a logged-in user',
      {
        tag: ['@GAD-R09-02'],
      },
      async ({ commentsRequest }) => {
        // Arrange
        const expectedStatusCode = 401;
        const commentData = prepareCommentPayload(articleId);

        // Act
        const responseComment = await commentsRequest.post(commentData);

        // Assert
        expect(responseComment.status()).toBe(expectedStatusCode);
      },
    );

    test(
      'should create a comment with a logged-in user',
      {
        tag: ['@GAD-R09-02'],
      },
      async ({ commentsRequestLoggedIn }) => {
        // Arrange
        const expectedStatusCode = 201;

        // Act
        const commentData = prepareCommentPayload(articleId);
        const responseComment = await createCommentWithApi(
          commentsRequestLoggedIn,
          commentData,
        );

        // Assert
        const actualResponseStatus = responseComment.status();
        expect(
          actualResponseStatus,
          `expected status code: ${expectedStatusCode}, received: ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        const comment = await responseComment.json();
        expect.soft(comment.body).toEqual(commentData.body);
      },
    );

    test(
      'should create new comment with a logged-in user when modified comment id does not exist',
      {
        tag: ['@GAD-R10-02'],
      },
      async ({ commentsRequestLoggedIn }) => {
        // Arrange
        const expectedStatusCodePut = 201;
        const commentData = prepareCommentPayload(articleId);

        // Act
        const responseCommentPut =
          await commentsRequestLoggedIn.putWithNonExistingCommentId(
            commentData,
          );

        // Assert PUT
        const actualResponseStatus = responseCommentPut.status();
        expect(
          actualResponseStatus,
          `expected status code: ${expectedStatusCodePut}, received: ${actualResponseStatus}`,
        ).toBe(expectedStatusCodePut);

        // Assert GET
        const commentPutJson = await responseCommentPut.json();
        const responseCommentGet = await commentsRequestLoggedIn.getOneComment(
          commentPutJson.id,
        );

        const commentGetJson = await responseCommentGet.json();
        expect.soft(commentGetJson.body).toEqual(commentData.body);
      },
    );
  },
);
