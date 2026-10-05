import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { Headers } from '@_src/api/models/header.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect } from '@_src/ui/fixtures/merge.fixture';
import { APIRequestContext, APIResponse } from '@playwright/test';

export async function createArticleWithApi(
  request: APIRequestContext,
  headers: Headers,
  articleData?: ArticlePayload,
): Promise<APIResponse> {
  const articleDataFinal = articleData || prepareArticlePayload();
  const responseArticle = await request.post(apiUrls.articlesUrl, {
    headers,
    data: articleDataFinal,
  });

  const articleJson = await responseArticle.json();
  const expectedStatusCode = 200;

  await expect(async () => {
    const responseArticleCreated = await request.get(
      `${apiUrls.articlesUrl}/${articleJson.id}`,
    );
    expect(
      responseArticleCreated.status(),
      `Expected status: ${expectedStatusCode}, observed: ${responseArticleCreated.status()}`,
    ).toBe(expectedStatusCode);
  }).toPass({ timeout: 2_000 });

  return responseArticle;
}
