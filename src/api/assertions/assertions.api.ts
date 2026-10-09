import { Headers } from '@_src/api/models/header.api.model';
import { expect } from '@_src/ui/fixtures/merge.fixture';
import { APIRequestContext } from '@playwright/test';

export async function expectGetResponseStatus(
  request: APIRequestContext,
  url: string,
  expectedStatusCode: number,
  headers?: Headers,
): Promise<void> {
  const responseGet = await request.get(url, { headers });

  expect(
    responseGet.status(),
    `expected status code: ${expectedStatusCode}, received: ${responseGet.status()}`,
  ).toBe(expectedStatusCode);
}

export async function expectDeleteResponseStatus(
  request: APIRequestContext,
  url: string,
  expectedStatusCode: number,
  headers?: Headers,
): Promise<void> {
  const responseGet = await request.delete(url, { headers });

  expect(
    responseGet.status(),
    `expected status code: ${expectedStatusCode}, received: ${responseGet.status()}`,
  ).toBe(expectedStatusCode);
}
