/* eslint-disable playwright/expect-expect */
import {
  expectDeleteResponseStatus,
  expectGetResponseStatus,
} from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthHeader } from '@_src/api/factories/auth-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { Headers } from '@_src/api/models/header.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { test } from '@_src/ui/fixtures/merge.fixture';

test.describe(
  'Verify comments DELETE operations',
  {
    tag: ['@CRUD', '@comments', '@DELETE'],
  },
  () => {
    let articleId: number;
    let commentId: number;
    let headers: Headers;

    test.beforeAll('create an article', async ({ request }) => {
      // User login
      headers = await getAuthHeader(request);

      // Create article
      const responseArticle = await createArticleWithApi(request, headers);

      const article = await responseArticle.json();
      articleId = article.id;
    });

    test.beforeEach('create a comment', async ({ request }) => {
      const responseComment = await createCommentWithApi(
        request,
        headers,
        articleId,
      );
      const commentJson = await responseComment.json();
      commentId = commentJson.id;
    });

    test(
      'should delete a comment with a logged-in user',
      {
        tag: ['@GAD-R09-04'],
      },
      async ({ request }) => {
        // Arrange
        const expectedStatusCodeDelete = 200;
        const expectedStatusCodeGet = 404;

        // Assert DELETE
        await expectDeleteResponseStatus(
          request,
          `${apiUrls.commentsUrl}/${commentId}`,
          expectedStatusCodeDelete,
          headers,
        );

        // Assert GET
        await expectGetResponseStatus(
          request,
          `${apiUrls.commentsUrl}/${commentId}`,
          expectedStatusCodeGet,
        );
      },
    );

    test(
      'should not delete a comment with a non logged-in user',
      {
        tag: ['@GAD-R09-04'],
      },
      async ({ request }) => {
        // Arrange
        const expectedStatusCodeDelete = 401;
        const expectedStatusCodeGet = 200;

        // Assert DELETE
        await expectDeleteResponseStatus(
          request,
          `${apiUrls.commentsUrl}/${commentId}`,
          expectedStatusCodeDelete,
        );

        // Assert GET
        await expectGetResponseStatus(
          request,
          `${apiUrls.commentsUrl}/${commentId}`,
          expectedStatusCodeGet,
        );
      },
    );
  },
);
