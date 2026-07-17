import { prepareRandomArticle } from '../src/factories/article.factory';
import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { AddArticleView } from '../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();

    await expect.soft(addArticleView.addNewHeader).toBeVisible();
  });

  test(
    'reject creating new article with empty title field',
    {
      tag: ['@GAD-R04-01'],
    },
    async () => {
      // Arrange
      const expectedErrorMessage = 'Article was not created';
      const articleData = prepareRandomArticle();
      articleData.title = '';

      // Act
      await addArticleView.createArticle(articleData);

      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
    },
  );

  test(
    'reject creating new article with empty body field',
    {
      tag: ['@GAD-R04-01'],
    },
    async () => {
      // Arrange
      const expectedErrorMessage = 'Article was not created';
      const articleData = prepareRandomArticle();
      articleData.body = '';

      // Act
      await addArticleView.createArticle(articleData);

      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
    },
  );

  test.describe('Title length', () => {
    test(
      'create new article with title with 128 signs',
      {
        tag: ['@GAD-R04-02'],
      },
      async ({ page }) => {
        // Arrange
        const expectedMessage = 'Article was created';
        const articlePage = new ArticlePage(page);
        const articleData = prepareRandomArticle(128);

        // Act
        await addArticleView.createArticle(articleData);

        // Assert
        await expect
          .soft(addArticleView.alertPopup)
          .toHaveText(expectedMessage);
        await expect
          .soft(articlePage.articleTitle)
          .toHaveText(articleData.title);
        await expect
          .soft(articlePage.articleBody)
          .toHaveText(articleData.body, { useInnerText: true });
      },
    );

    test(
      'reject creating new article with title exceeding 128 signs',
      {
        tag: ['@GAD-R04-02'],
      },
      async () => {
        // Arrange
        const expectedErrorMessage = 'Article was not created';
        const articleData = prepareRandomArticle(129);

        // Act
        await addArticleView.createArticle(articleData);

        // Assert
        await expect(addArticleView.alertPopup).toHaveText(
          expectedErrorMessage,
        );
      },
    );
  });
});
