import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { AddArticleView } from '../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  test(
    'create new article',
    {
      tag: ['@GAD-R04-01'],
    },
    async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUser1);

      const articlesPage = new ArticlesPage(page);
      await articlesPage.goto();

      const expectedText = 'Article was created';
      const newArticleTitle = 'test-title';
      const newArticleBody = 'test-body';

      // Act
      await articlesPage.addArticleButtonLogged.click();

      const addArticleView = new AddArticleView(page);
      await expect.soft(addArticleView.header).toBeVisible();

      await addArticleView.titleInput.fill(newArticleTitle);
      await addArticleView.bodyInput.fill(newArticleBody);
      await addArticleView.saveButton.click();
      // Assert
      await expect.soft(addArticleView.alertPopup).toHaveText(expectedText);

      const articlePage = new ArticlePage(page);
      await expect.soft(articlePage.articleTitle).toHaveText(newArticleTitle);
      await expect.soft(articlePage.articleBody).toHaveText(newArticleBody);
    },
  );
});
