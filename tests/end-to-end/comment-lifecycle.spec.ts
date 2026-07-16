import { PrepareRandomNewArticle } from '../../src/factories/article.factory';
import { addArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
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

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    addCommentView = new AddCommentView(page);
    articlePage = new ArticlePage(page);

    articleData = PrepareRandomNewArticle();

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

      // Act
      await articlePage.addCommentButton.click();
      await expect.soft(addCommentView.addNewHeader).toBeVisible();
      await expect
        .soft(addCommentView.addNewHeader)
        .toHaveText(expectedAddCommentViewHeader);
      await addCommentView.bodyInput.fill('Hello!');
      await addCommentView.saveButton.click();

      // Assert
      await expect(articlePage.alertPopup).toHaveText(expectedAlertText);
    },
  );
});
