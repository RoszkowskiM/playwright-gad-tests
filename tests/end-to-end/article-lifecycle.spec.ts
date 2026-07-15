import { PrepareRandomNewArticle } from '../../src/factories/article.factory';
import { addArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Create, verify and delete article', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: addArticleModel;
  let articlePage: ArticlePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
  });

  test(
    'user can create new article',
    {
      tag: ['@GAD-R04-01'],
    },
    async () => {
      // Arrange
      const expectedText = 'Article was created';

      articleData = PrepareRandomNewArticle();

      // Act
      await articlesPage.addArticleButtonLogged.click();
      await expect.soft(addArticleView.addNewHeader).toBeVisible();
      await addArticleView.createArticle(articleData);

      // Assert
      await expect.soft(addArticleView.alertPopup).toHaveText(expectedText);
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );

  test(
    'user can access single article',
    {
      tag: ['@GAD-R04-03'],
    },
    async () => {
      // Act
      await articlesPage.goToArticle(articleData.title);

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );

  test(
    'user can delete his own article',
    {
      tag: ['@GAD-R04-04'],
    },
    async () => {
      // Arrange
      await articlesPage.goToArticle(articleData.title);

      // Act
      articlePage.deleteArticle();

      // Assert
      await articlesPage.waitForPageToLoadUrl();
      const title = await articlesPage.title();
      expect(title).toContain('Articles');

      await articlesPage.searchArticle(articleData.title);
      await expect(articlesPage.noSearchResult).toHaveText('No data');
    },
  );
});
