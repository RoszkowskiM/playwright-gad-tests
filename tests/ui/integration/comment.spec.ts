import { prepareRandomComment } from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { waitForResponse } from '@_src/utils/wait.util';

test.describe('comments API', () => {
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
});
