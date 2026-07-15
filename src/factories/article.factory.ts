import { addArticleModel } from '../models/article.model';
import { faker } from '@faker-js/faker/locale/en';

export function PrepareRandomNewArticle(
  titleLength?: number,
  bodyParagraphs = 5,
): addArticleModel {
  let title: string;

  if (titleLength) {
    title = faker.string.alpha(titleLength);
  } else {
    title = faker.lorem.sentence();
  }
  const body = faker.lorem.paragraphs(bodyParagraphs);

  const articleData: addArticleModel = { title: title, body: body };

  return articleData;
}
