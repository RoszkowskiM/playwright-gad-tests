import { randomNewArticle } from '../src/factories/article.factory';
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

      const articleData = randomNewArticle();

      const expectedText = 'Article was created';

      // Act
      await articlesPage.addArticleButtonLogged.click();

      const addArticleView = new AddArticleView(page);
      await expect.soft(addArticleView.header).toBeVisible();

      await addArticleView.createArticle(articleData);

      // Assert
      await expect.soft(addArticleView.alertPopup).toHaveText(expectedText);

      const articlePage = new ArticlePage(page);
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );
});
