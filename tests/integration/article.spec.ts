import { ArticlePage } from '@_src/pages/article.page';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  test(
    'non logged user can access created article',
    {
      tag: ['@GAD-R06-01', '@predefined_data'],
    },
    async ({ page }) => {
      // Arrange
      const articlePage = new ArticlePage(page);
      const expectedArticleTitle = 'How to write effective test cases';

      // Act
      articlePage.goto('?id=1');

      // Assert
      await expect(articlePage.articleTitle).toHaveText(expectedArticleTitle);
    },
  );
});
