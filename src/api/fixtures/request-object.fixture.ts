import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { test as baseTest } from '@playwright/test';

interface Requests {
  articlesRequest: ArticlesRequest;
}

export const requestObjectTest = baseTest.extend<Requests>({
  articlesRequest: async ({ request }, use) => {
    const articlesRequest = new ArticlesRequest(request);
    await use(articlesRequest);
  },
});
