import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment-payload.api.model';
import { expect, test } from '@_src/merge.fixture';

test.describe(
  'Verify comments UPDATE operations',
  {
    tag: ['@CRUD', '@comments', '@UPDATE'],
  },
  () => {
    let articleId: number;
    let commentId: number;
    let commentData: CommentPayload;

    test.beforeAll('create an article', async ({ articlesRequestLoggedIn }) => {
      const responseArticle = await createArticleWithApi(
        articlesRequestLoggedIn,
      );

      const article = await responseArticle.json();
      articleId = article.id;
    });

    test.beforeEach('create a comment', async ({ commentsRequestLoggedIn }) => {
      commentData = prepareCommentPayload(articleId);
      const responseComment = await createCommentWithApi(
        commentsRequestLoggedIn,
        commentData,
      );
      const commentJson = await responseComment.json();
      commentId = commentJson.id;
    });

    test.describe(
      'fully modify comment',
      {
        tag: ['@PUT'],
      },
      () => {
        test(
          'should modify and replace content for a comment fon a logged-in user',
          {
            tag: ['@GAD-R10-02'],
          },
          async ({ commentsRequestLoggedIn }) => {
            // Arrange
            const expectedStatusCodePut = 200;
            const modifiedCommentData = prepareCommentPayload(articleId);

            // Act
            const responseCommentPut = await commentsRequestLoggedIn.put(
              commentId,
              modifiedCommentData,
            );

            // Assert PUT
            const actualResponseStatus = responseCommentPut.status();
            expect(
              actualResponseStatus,
              `expected status code: ${expectedStatusCodePut}, received: ${actualResponseStatus}`,
            ).toBe(expectedStatusCodePut);

            // Assert GET
            const modifiedCommentGet =
              await commentsRequestLoggedIn.getOneComment(commentId);

            const modifiedCommentJson = await modifiedCommentGet.json();
            expect
              .soft(modifiedCommentJson.body)
              .toEqual(modifiedCommentData.body);
            expect.soft(modifiedCommentJson.body).not.toEqual(commentData.body);
          },
        );

        test(
          'should not modify a comment with a non logged-in user',
          {
            tag: ['@GAD-R10-02'],
          },
          async ({ commentsRequest }) => {
            // Arrange
            const expectedStatusCodePut = 401;
            const modifiedCommentData = prepareCommentPayload(articleId);

            // Act
            const responseCommentPut = await commentsRequest.put(
              commentId,
              modifiedCommentData,
            );

            // Assert PUT
            const actualResponseStatus = responseCommentPut.status();
            expect(
              actualResponseStatus,
              `expected status code: ${expectedStatusCodePut}, received: ${actualResponseStatus}`,
            ).toBe(expectedStatusCodePut);

            // Assert GET
            const nonModifiedComment =
              await commentsRequest.getOneComment(commentId);

            const nonModifiedCommentJson = await nonModifiedComment.json();
            expect
              .soft(nonModifiedCommentJson.body)
              .not.toEqual(modifiedCommentData.body);
            expect.soft(nonModifiedCommentJson.body).toEqual(commentData.body);
          },
        );
      },
    );

    test.describe(
      'partially modify comment',
      {
        tag: ['@PATCH'],
      },
      () => {
        test(
          'should partially update content for a comment with a logged-in user',
          {
            tag: ['@GAD-R10-04'],
          },
          async ({ commentsRequestLoggedIn }) => {
            // Arrange
            const expectedStatusCodePatch = 200;
            const modifiedCommentData = {
              body: `Patched comment body ${new Date().toISOString()}`,
            };

            // Act
            const responseCommentPatch = await commentsRequestLoggedIn.patch(
              commentId,
              modifiedCommentData,
            );

            // Assert PATCH
            const actualResponseStatus = responseCommentPatch.status();
            expect(
              actualResponseStatus,
              `expected status code: ${expectedStatusCodePatch}, received: ${actualResponseStatus}`,
            ).toBe(expectedStatusCodePatch);

            // Assert GET
            const modifiedCommentGet =
              await commentsRequestLoggedIn.getOneComment(commentId);

            const modifiedCommentJson = await modifiedCommentGet.json();

            expect
              .soft(modifiedCommentJson.body)
              .toEqual(modifiedCommentData.body);

            expect.soft(modifiedCommentJson.date).toEqual(commentData.date);
          },
        );

        test(
          'should not partially modify a comment with a non logged-in user',
          {
            tag: ['@GAD-R10-04'],
          },
          async ({ commentsRequest }) => {
            // Arrange
            const expectedStatusCodePut = 401;
            const modifiedCommentData = {
              body: `Patched comment body ${new Date().toISOString()}`,
            };

            // Act
            const responseCommentPatch = await commentsRequest.patch(
              commentId,
              modifiedCommentData,
            );

            // Assert PATCH
            const actualResponseStatus = responseCommentPatch.status();
            expect(
              actualResponseStatus,
              `expected status code: ${expectedStatusCodePut}, received: ${actualResponseStatus}`,
            ).toBe(expectedStatusCodePut);

            // Assert GET
            const nonModifiedComment =
              await commentsRequest.getOneComment(commentId);

            const nonModifiedCommentJson = await nonModifiedComment.json();

            expect
              .soft(nonModifiedCommentJson.body)
              .not.toEqual(modifiedCommentData.body);

            expect.soft(nonModifiedCommentJson.body).toEqual(commentData.body);
          },
        );

        test(
          'should not partially modify a comment with improper field with a logged-in user',
          {
            tag: ['@GAD-R10-04'],
          },
          async ({ commentsRequestLoggedIn }) => {
            // Arrange
            const expectedStatusCodePut = 422;
            const nonExistingField = `nonExistingField`;

            const expectedErrorMessage =
              `One of field is invalid (empty, invalid or too long) or there are some additional fields:` +
              ` Field validation: "${nonExistingField}" not in [id,user_id,article_id,body,date]`;

            const modifiedCommentData: Record<string, string> = {};
            modifiedCommentData[nonExistingField] = 'Hello';

            // Act
            const responseCommentPatch = await commentsRequestLoggedIn.patch(
              commentId,
              modifiedCommentData,
            );

            // Assert PUT
            const actualResponseStatus = responseCommentPatch.status();
            expect(
              actualResponseStatus,
              `expected status code: ${expectedStatusCodePut}, received: ${actualResponseStatus}`,
            ).toBe(expectedStatusCodePut);

            const responseJson = await responseCommentPatch.json();
            expect
              .soft(responseJson.error.message)
              .toEqual(expectedErrorMessage);
          },
        );
      },
    );
  },
);
