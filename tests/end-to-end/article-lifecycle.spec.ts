import { prepareRandomArticle } from '@_src/factories/article.factory';
import { addArticleModel } from '@_src/models/article.model';
import { ArticlesPage } from '@_src/pages/articles.page';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Create, verify and delete article', () => {
  let articlesPage: ArticlesPage;
  let articleData: addArticleModel;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);

    await articlesPage.goto();
  });

  test(
    'user can create new article',
    {
      tag: ['@GAD-R04-01', '@logged'],
    },
    async () => {
      // Arrange
      const expectedText = 'Article was created';

      articleData = prepareRandomArticle();

      // Act
      const addArticleView = await articlesPage.clickAddArticleButtonLogged();
      await expect.soft(addArticleView.addNewHeader).toBeVisible();
      const articlePage = await addArticleView.createArticle(articleData);

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
      tag: ['@GAD-R04-03', '@logged'],
    },
    async () => {
      // Act
      const articlePage = await articlesPage.goToArticle(articleData.title);

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
      tag: ['@GAD-R04-04', '@logged'],
    },
    async () => {
      // Arrange
      const expectedNoResultText = 'No data';
      const expectedArticlesPageTitle = 'Articles';
      const articlePage = await articlesPage.goToArticle(articleData.title);

      // Act
      articlesPage = await articlePage.deleteArticle();

      // Assert
      await articlesPage.waitForPageToLoadUrl();
      const title = await articlesPage.getTitle();
      expect(title).toContain(expectedArticlesPageTitle);

      articlesPage = await articlesPage.searchArticle(articleData.title);
      await expect(articlesPage.noSearchResult).toHaveText(
        expectedNoResultText,
      );
    },
  );
});
