export interface ArticlePayload {
  title: string;
  body: string;
  date: string;
  image: string;
}

export interface CommentPayload {
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
