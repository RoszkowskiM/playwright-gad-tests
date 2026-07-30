import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { addArticleModel } from '@_src/models/article.model';
import { addCommentModel } from '@_src/models/comment.model';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let articlesPage: ArticlesPage;
  let articleData: addArticleModel;
  let articlePage: ArticlePage;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    articlePage = new ArticlePage(page);

    articleData = prepareRandomArticle();

    await articlesPage.goto();
    const addArticleView = await articlesPage.clickAddArticleButtonLogged();
    articlePage = await addArticleView.createArticle(articleData);
  });

  test(
    'operate on comments',
    {
      tag: ['@GAD-R05-01', '@GAD-R05-02', '@logged'],
    },
    async () => {
      let newCommentData: addCommentModel;

      await test.step('user can create new comment', async () => {
        // Arrange
        newCommentData = prepareRandomComment();
        const expectedAddCommentViewHeader = 'Add New Comment';
        const expectedCommentCreatedAlertText = 'Comment was created';

        // Act
        const addCommentView = await articlePage.clickAddCommentButton();
        await expect.soft(addCommentView.addNewHeader).toBeVisible();
        await expect
          .soft(addCommentView.addNewHeader)
          .toHaveText(expectedAddCommentViewHeader);
        await addCommentView.createComment(newCommentData);

        // Assert
        await expect
          .soft(articlePage.alertPopup)
          .toHaveText(expectedCommentCreatedAlertText);
      });

      const commentPage =
        await test.step('user can verify new comment', async () => {
          // Act
          const articleComment = articlePage.getArticleComment(
            newCommentData.body,
          );

          // Assert
          await expect(articleComment.body).toHaveText(newCommentData.body);
          const commentPage = await articlePage.clickCommentLink(
            articleComment.link,
          );
          await expect(commentPage.commentBody).toHaveText(newCommentData.body);

          return commentPage;
        });

      let editCommentData: addCommentModel;

      await test.step('user can update comment', async () => {
        // Arrange
        editCommentData = prepareRandomComment();
        const expectedCommentUpdatedAlertText = 'Comment was updated';

        // Act
        const editCommentView = await commentPage.clickEditComment();
        await editCommentView.updateComment(editCommentData);

        // Assert
        await expect
          .soft(commentPage.alertPopup)
          .toHaveText(expectedCommentUpdatedAlertText);
        await expect(commentPage.commentBody).toHaveText(editCommentData.body);
      });

      await test.step('user can verify updated comment on article page', async () => {
        // Act
        articlePage = await commentPage.clickReturnToArticleLink();
        const updatedArticleComment = articlePage.getArticleComment(
          editCommentData.body,
        );

        // Assert
        await expect(updatedArticleComment.body).toHaveText(
          editCommentData.body,
        );
      });
    },
  );

  test(
    'user can add more than one comment to article',
    {
      tag: ['@GAD-R05-03', '@logged'],
    },
    async () => {
      await test.step('user can create first comment', async () => {
        // Arrange
        const newCommentData = prepareRandomComment();
        const expectedCommentCreatedAlertText = 'Comment was created';

        // Act
        const addCommentView = await articlePage.clickAddCommentButton();
        await addCommentView.createComment(newCommentData);

        // Assert
        await expect
          .soft(articlePage.alertPopup)
          .toHaveText(expectedCommentCreatedAlertText);
      });

      await test.step('user can create and verify second comment', async () => {
        const secondCommentBody =
          await test.step('create comment', async () => {
            const secondCommentData = prepareRandomComment();
            const addCommentView = await articlePage.clickAddCommentButton();
            await addCommentView.createComment(secondCommentData);
            return secondCommentData.body;
          });

        await test.step('verify comment', async () => {
          const articleComment =
            articlePage.getArticleComment(secondCommentBody);
          await expect(articleComment.body).toHaveText(secondCommentBody);
          const commentPage = await articlePage.clickCommentLink(
            articleComment.link,
          );
          await expect(commentPage.commentBody).toHaveText(secondCommentBody);
        });
      });
    },
  );
});
