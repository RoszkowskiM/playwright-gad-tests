import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareAndCreateCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { expect, test } from '@_src/merge.fixture';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { addCommentModel } from '@_src/ui/models/comment.model';
import { CommentPage } from '@_src/ui/pages/comment.page';
import { waitForResponse } from '@_src/ui/utils/wait.util';

test.describe('comments API', () => {
  let commentPageNew: CommentPage;
  let editCommentData: addCommentModel;

  test(
    'should return created comment from API',
    {
      tag: ['@GAD-R07-06', '@logged'],
    },
    async ({ createRandomArticle, page }) => {
      // Arrange
      const expectedCommentCreatedAlertText = 'Comment was created';
      const newCommentData = prepareRandomComment();
      let articlePage = createRandomArticle.articlePage;

      // Act
      const addCommentView = await articlePage.clickAddCommentButton();
      articlePage = await addCommentView.createComment(newCommentData);

      const waitParams = {
        page,
        url: '/api/comments',
        method: 'GET',
        text: newCommentData.body,
      };

      const response = await waitForResponse(waitParams);

      // Assert
      await expect
        .soft(articlePage.alertPopup)
        .toHaveText(expectedCommentCreatedAlertText);
      expect(response.ok()).toBeTruthy();
    },
  );

  test(
    'should reject comment update when body is empty',
    {
      tag: ['@GAD-R07-06', '@logged'],
    },
    async ({
      articlesRequestLoggedIn,
      commentPage,
      commentsRequestLoggedIn,
    }) => {
      // Create article and comment with API
      const responseArticle = await createArticleWithApi(
        articlesRequestLoggedIn,
      );
      const articleJson = await responseArticle.json();

      const responseComment = await prepareAndCreateCommentWithApi(
        commentsRequestLoggedIn,
        articleJson.id,
      );
      const commentJson = await responseComment.json();

      await commentPage.goToId(commentJson.id);

      // Arrange
      editCommentData = prepareRandomComment(0);
      const expectedErrorMessage = 'Comment was not updated';

      // Act
      const editCommentView = await commentPage.clickEditComment();
      commentPageNew = await editCommentView.updateComment(editCommentData);

      // Assert
      await expect(commentPageNew.alertPopup).toHaveText(expectedErrorMessage);

      // Assert comment
      await editCommentView.cancelButton.click();
      await expect(commentPageNew.commentBody).toHaveText(commentJson.body);
    },
  );
});
