export const apiUrls = {
  loginUrl: '/api/login',
  articlesUrl: '/api/articles',
  commentsUrl: '/api/comments',
};

export async function timestamp(): Promise<number> {
  return new Date().valueOf();
}

// alternatively:
// export function timestamp(): string {
//   return `${new Date().valueOf()}`;
// }
