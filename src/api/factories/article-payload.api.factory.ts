import { ArticlePayload } from '@_src/api/utils/api.util';
import { prepareRandomArticle } from '@_src/ui/factories/article.factory';

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
