import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { waitForResponse } from '@_src/utils/wait.util';

test.describe('Verify articles', () => {
  test(
    'reject creating new article with empty title field',
    {
      tag: ['@GAD-R04-01', '@GAD-R07-03', '@logged'],
    },
    async ({ addArticleView, page }) => {
      // Arrange
      const expectedErrorMessage = 'Article was not created';
      const expectedResponseCode = 422;

      const articleData = prepareRandomArticle();
      articleData.title = '';

      // Act
      await addArticleView.createArticle(articleData);
      const response = await waitForResponse(page, 'api/articles', 'POST', 422);

      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
      expect(response.status()).toBe(expectedResponseCode);
    },
  );

  test(
    'reject creating new article with empty body field',
    {
      tag: ['@GAD-R04-01', '@GAD-R07-03', '@logged'],
    },
    async ({ addArticleView, page }) => {
      // Arrange
      const expectedErrorMessage = 'Article was not created';
      const expectedResponseCode = 422;

      const articleData = prepareRandomArticle();
      articleData.body = '';

      // Act
      await addArticleView.createArticle(articleData);
      const response = await waitForResponse(page, 'api/articles');

      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
      expect(response.status()).toBe(expectedResponseCode);
    },
  );

  test.describe('Title length', () => {
    test(
      'create new article with title with 128 signs',
      {
        tag: ['@GAD-R04-02', '@GAD-R07-03', '@logged'],
      },
      async ({ addArticleView, page }) => {
        // Arrange
        const expectedMessage = 'Article was created';
        const expectedResponseCode = 201;

        const articleData = prepareRandomArticle(128);

        // Act
        const articlePage = await addArticleView.createArticle(articleData);
        const response = await waitForResponse(page, 'api/articles');

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
        expect(response.status()).toBe(expectedResponseCode);
      },
    );

    test(
      'reject creating new article with title exceeding 128 signs',
      {
        tag: ['@GAD-R04-02', '@GAD-R07-03', '@logged'],
      },
      async ({ addArticleView, page }) => {
        // Arrange
        const expectedErrorMessage = 'Article was not created';
        const expectedResponseCode = 422;

        const articleData = prepareRandomArticle(129);

        // Act
        await addArticleView.createArticle(articleData);
        const response = await waitForResponse(page, 'api/articles');

        // Assert
        await expect(addArticleView.alertPopup).toHaveText(
          expectedErrorMessage,
        );
        expect(response.status()).toBe(expectedResponseCode);
      },
    );
  });

  test(
    'should return created article from API',
    {
      tag: ['@GAD-R07-04', '@logged'],
    },
    async ({ addArticleView, page }) => {
      // Arrange
      const articleData = prepareRandomArticle();

      // Act
      const articlePage = await addArticleView.createArticle(articleData);
      const response = await waitForResponse(page, '/api/articles', 'GET', 200);

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      expect(response.ok()).toBeTruthy();
    },
  );
});
