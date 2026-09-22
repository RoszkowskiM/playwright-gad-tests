import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify menu main buttons', () => {
  test(
    'comments button navigates to comments page',
    {
      tag: ['@GAD-R01-03'],
    },
    async ({ articlesPage }) => {
      // Act
      const commentsPage = await articlesPage.mainMenu.clickCommentsButton();
      const title = await commentsPage.getTitle();

      // Assert
      expect(title).toContain('Comments');
    },
  );

  test(
    'articles button navigates to articles page',
    {
      tag: ['@GAD-R01-03'],
    },
    async ({ commentsPage }) => {
      // Arrange
      const expectedArticlesPageTitle = 'Articles';

      // Act
      const articlesPage = await commentsPage.mainMenu.clickArticlesButton();
      const title = await articlesPage.getTitle();

      // Assert
      expect(title).toContain(expectedArticlesPageTitle);
    },
  );

  test(
    'home page button navigates to home page',
    {
      tag: ['@GAD-R01-03'],
    },
    async ({ articlesPage }) => {
      // Arrange
      const expectedHomePageTitle = 'GAD';

      // Act
      const homePage = await articlesPage.mainMenu.clickHomePageLink();
      const title = await homePage.getTitle();

      // Assert
      expect(title).toContain(expectedHomePageTitle);
    },
  );
});
