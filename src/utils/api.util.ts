import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { testUser1 } from '@_src/test-data/user.data';
import { APIRequestContext } from '@playwright/test';

export interface ArticlePayload {
  title: string;
  body: string;
  date: string;
  image: string;
}

interface CommentPayload {
  article_id: number;
  body: string;
  date: string;
}
export interface Headers {
  [key: string]: string;
}

export const apiLinks = {
  loginUrl: '/api/login',
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
};

export async function getAuthHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const userData = {
    email: testUser1.userEmail,
    password: testUser1.userPassword,
  };

  const responseLogin = await request.post(apiLinks.loginUrl, {
    data: userData,
  });
  const responseLoginJson = await responseLogin.json();

  return {
    Authorization: `Bearer ${responseLoginJson.access_token}`,
  };
}

export function prepareArticlePayload(): ArticlePayload {
  const randomArticleData = prepareRandomArticle();
  const articleData = {
    title: randomArticleData.title,
    body: randomArticleData.body,
    date: '2026-09-16T07:18:47.823Z',
    image: '.\\data\\images\\256\\andrew-svk-nQvFebPtqbw-unsplash.jpg',
  };
  return articleData;
}

export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment();
  const commentData = {
    article_id: articleId,
    body: randomCommentData.body,
    date: '2026-09-16T07:18:47.823Z',
  };
  return commentData;
}
