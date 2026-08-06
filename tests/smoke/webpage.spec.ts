import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify service main pages', () => {
  test(
    'home page title',
    {
      tag: ['@GAD-R01-01'],
    },
    async ({ homePage }) => {
      // Arrange
      const expectedHomePageTitle = 'GAD';

      // Assert
      const title = await homePage.getTitle();
      expect(title).toContain(expectedHomePageTitle);
    },
  );

  test(
    'articles page',
    {
      tag: ['@GAD-R01-02'],
    },
    async ({ articlesPage }) => {
      // Arrange
      const expectedArticlesPageTitle = 'Articles';

      // Assert
      const title = await articlesPage.getTitle();
      expect(title).toContain(expectedArticlesPageTitle);
    },
  );

  test(
    'comments page',
    {
      tag: ['@GAD-R01-02'],
    },
    async ({ commentsPage }) => {
      // Arrange
      const expectedCommentsPageTitle = 'Comments';

      // Assert
      const title = await commentsPage.getTitle();
      expect(title).toContain(expectedCommentsPageTitle);
    },
  );
});
