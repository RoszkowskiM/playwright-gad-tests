import { getAuthHeader } from '@_src/api/factories/auth-header.api.factory';
import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { CommentsRequest } from '@_src/api/requests/comments.request';
import { test as baseTest } from '@playwright/test';

interface Requests {
  articlesRequest: ArticlesRequest;
  articlesRequestLoggedIn: ArticlesRequest;
  commentsRequest: CommentsRequest;
  commentsRequestLoggedIn: CommentsRequest;
}

export const requestObjectTest = baseTest.extend<Requests>({
  articlesRequest: async ({ request }, use) => {
    const articlesRequest = new ArticlesRequest(request);
    await use(articlesRequest);
  },

  articlesRequestLoggedIn: async ({ request }, use) => {
    const headers = await getAuthHeader(request);
    const articlesRequest = new ArticlesRequest(request, headers);
    await use(articlesRequest);
  },

  commentsRequest: async ({ request }, use) => {
    const commentsRequest = new CommentsRequest(request);
    await use(commentsRequest);
  },

  commentsRequestLoggedIn: async ({ request }, use) => {
    const headers = await getAuthHeader(request);
    const commentsRequest = new CommentsRequest(request, headers);
    await use(commentsRequest);
  },
});
