import { addArticleModel } from '../models/article.model';
import { faker } from '@faker-js/faker/locale/en';

export function randomNewArticle(): addArticleModel {
  const title = faker.lorem.sentence();
  const body = faker.lorem.paragraphs(5);

  const articleData: addArticleModel = { title: title, body: body };

  return articleData;
}
