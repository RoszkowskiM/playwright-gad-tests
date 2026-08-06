import { Pages } from '@_src/interfaces/pages.interface';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { test as baseTest } from '@playwright/test';

export const pageObjectTest = baseTest.extend<Pages>({
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
