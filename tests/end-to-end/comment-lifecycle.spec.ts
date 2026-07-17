import { prepareRandomArticle } from '../../src/factories/article.factory';
import { prepareRandomComment } from '../../src/factories/comment.factory';
import { addArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { AddCommentView } from '../../src/views/add-comment.view';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let addCommentView: AddCommentView;
  let articleData: addArticleModel;
  let articlePage: ArticlePage;
  let commentPage: CommentPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    addCommentView = new AddCommentView(page);
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
    'user can create new comment',
    {
      tag: ['@GAD-R05-01'],
    },
    async () => {
      // Create new comment
      // Arrange
      const expectedAlertText = 'Comment was created';
      const expectedAddCommentViewHeader = 'Add New Comment';

      const newCommentData = prepareRandomComment();

      // Act
      await articlePage.addCommentButton.click();
      await expect.soft(addCommentView.addNewHeader).toBeVisible();
      await expect
        .soft(addCommentView.addNewHeader)
        .toHaveText(expectedAddCommentViewHeader);
      await addCommentView.bodyInput.fill(newCommentData.body);
      await addCommentView.saveButton.click();

      // Assert
      await expect(articlePage.alertPopup).toHaveText(expectedAlertText);

      // Verify comment
      // Act
      const ArticleComment = articlePage.getArticleComment(newCommentData.body);

      // Assert
      await expect(ArticleComment.body).toHaveText(newCommentData.body);
      await ArticleComment.link.click();
      await expect(commentPage.commentBody).toHaveText(newCommentData.body);
    },
  );
});
