import { prepareRandomArticle } from '../../src/factories/article.factory';
import { prepareRandomComment } from '../../src/factories/comment.factory';
import { addArticleModel } from '../../src/models/article.model';
import { addCommentModel } from '../../src/models/comment.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { AddCommentView } from '../../src/views/add-comment.view';
import { EditCommentView } from '../../src/views/edit-comment.view';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let addCommentView: AddCommentView;
  let editCommentView: EditCommentView;
  let articleData: addArticleModel;
  let articlePage: ArticlePage;
  let commentPage: CommentPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    addCommentView = new AddCommentView(page);
    editCommentView = new EditCommentView(page);
    articlePage = new ArticlePage(page);
    commentPage = new CommentPage(page);

    articleData = prepareRandomArticle();

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);
  });

  test(
    'operate on comments',
    {
      tag: ['@GAD-R05-01', '@GAD-R05-02'],
    },
    async () => {
      // Arrange
      const newCommentData = prepareRandomComment();

      await test.step('user can create new comment', async () => {
        // Arrange
        const expectedCommentCreatedAlertText = 'Comment was created';
        const expectedAddCommentViewHeader = 'Add New Comment';

        // Act
        await articlePage.addCommentButton.click();
        await expect.soft(addCommentView.addNewHeader).toBeVisible();
        await expect
          .soft(addCommentView.addNewHeader)
          .toHaveText(expectedAddCommentViewHeader);
        await addCommentView.addNewComment(newCommentData);

        // Assert
        await expect
          .soft(articlePage.alertPopup)
          .toHaveText(expectedCommentCreatedAlertText);
      });

      await test.step('user can verify new comment', async () => {
        // Act
        const articleComment = articlePage.getArticleComment(
          newCommentData.body,
        );

        // Assert
        await expect(articleComment.body).toHaveText(newCommentData.body);
        await articleComment.link.click();
        await expect(commentPage.commentBody).toHaveText(newCommentData.body);
      });

      let editCommentData: addCommentModel;

      await test.step('user can update comment', async () => {
        // Arrange
        editCommentData = prepareRandomComment();
        const expectedCommentUpdatedAlertText = 'Comment was updated';

        // Act
        await commentPage.editCommentIcon.click();
        await editCommentView.updateComment(editCommentData);

        // Assert
        await expect
          .soft(commentPage.alertPopup)
          .toHaveText(expectedCommentUpdatedAlertText);
        await expect(commentPage.commentBody).toHaveText(editCommentData.body);
      });

      await test.step('user can verify updated comment on article page', async () => {
        // Act
        await commentPage.returnToArticleLink.click();
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
});
