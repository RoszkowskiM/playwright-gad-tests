import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { Headers } from '@_src/api/models/header.api.model';
import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { expect } from '@_src/merge.fixture';
import { APIResponse } from '@playwright/test';

export async function createArticleWithApi(
  articlesRequest: ArticlesRequest,
  headers: Headers,
  articleData?: ArticlePayload,
): Promise<APIResponse> {
  const articleDataFinal = articleData || prepareArticlePayload();
  const responseArticle = await articlesRequest.post(headers, articleDataFinal);

  const articleJson = await responseArticle.json();
  const expectedStatusCode = 200;

  await expect(async () => {
    const responseArticleCreated = await articlesRequest.getOneArticle(
      articleJson.id,
    );
    expect(
      responseArticleCreated.status(),
      `Expected status: ${expectedStatusCode}, observed: ${responseArticleCreated.status()}`,
    ).toBe(expectedStatusCode);
  }).toPass({ timeout: 2_000 });

  return responseArticle;
}
