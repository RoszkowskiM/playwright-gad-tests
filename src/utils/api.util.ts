import { prepareRandomArticle } from '@_src/factories/article.factory';
import { testUser1 } from '@_src/test-data/user.data';
import { APIRequestContext } from '@playwright/test';

interface Headers {
  [key: string]: string;
}

export async function getAuthHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const loginUrl = '/api/login';
  const userData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  };

  const responseLogin = await request.post(loginUrl, {
    data: userData,
  });
  const responseLoginJson = await responseLogin.json();

  return {
    Authorization: `Bearer ${responseLoginJson.access_token}`,
  };
}

interface articlePayload {
  title: string;
  body: string;
  date: string;
  image: string;
}

export function prepareArticlePayload(): articlePayload {
  const randomArticleData = prepareRandomArticle();
  const articleData = {
    title: randomArticleData.title,
    body: randomArticleData.body,
    date: '2026-09-16T07:18:47.823Z',
    image: '.\\data\\images\\256\\andrew-svk-nQvFebPtqbw-unsplash.jpg',
  };
  return articleData;
}
