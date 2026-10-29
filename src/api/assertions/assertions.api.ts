import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { CommentsRequest } from '@_src/api/requests/comments.request';
import { expect } from '@_src/merge.fixture';

export async function expectGetOneResponseStatus(
  requestObject: ArticlesRequest | CommentsRequest,
  id: number,
  expectedStatusCode: number,
): Promise<void> {
  const responseGet = await requestObject.getOne(id);

  expect(
    responseGet.status(),
    `expected status code: ${expectedStatusCode}, received: ${responseGet.status()}`,
  ).toBe(expectedStatusCode);
}
