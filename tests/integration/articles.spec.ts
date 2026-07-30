import { prepareRandomArticle } from '@_src/factories/article.factory';
import { ArticlesPage } from '@_src/pages/articles.page';
import { AddArticleView } from '@_src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);

    await articlesPage.goto();
    addArticleView = await articlesPage.clickAddArticleButtonLogged();

    await expect.soft(addArticleView.addNewHeader).toBeVisible();
  });

  test(
    'reject creating new article with empty title field',
    {
      tag: ['@GAD-R04-01', '@logged'],
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
      tag: ['@GAD-R04-01', '@logged'],
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
        tag: ['@GAD-R04-02', '@logged'],
      },
      async () => {
        // Arrange
        const expectedMessage = 'Article was created';
        const articleData = prepareRandomArticle(128);

        // Act
        const articlePage = await addArticleView.createArticle(articleData);

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
        tag: ['@GAD-R04-02', '@logged'],
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
