import { Pages } from '@_src/interfaces/pages.interface';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { test as baseTest, expect } from '@playwright/test';

const test = baseTest.extend<Pages>({
  articlesPage: async ({ page }, use) => {
    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();
    await use(new ArticlesPage(page));
  },
  commentsPage: async ({ page }, use) => {
    const commentsPage = new CommentsPage(page);
    await commentsPage.goto();
    await use(new CommentsPage(page));
  },
});

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
