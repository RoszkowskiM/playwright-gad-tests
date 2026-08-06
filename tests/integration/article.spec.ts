import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles', () => {
  test(
    'non logged user can access created article',
    {
      tag: ['@GAD-R06-01', '@predefined_data'],
    },
    async ({ articlePage }) => {
      // Arrange
      const expectedArticleTitle = 'How to write effective test cases';

      // Act
      articlePage.goto('?id=1');

      // Assert
      await expect(articlePage.articleTitle).toHaveText(expectedArticleTitle);
    },
  );
});
