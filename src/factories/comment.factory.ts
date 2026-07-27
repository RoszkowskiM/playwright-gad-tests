import { addCommentModel } from '@_src/models/comment.model';
import { faker } from '@faker-js/faker/locale/en';

export function prepareRandomComment(bodySentences = 5): addCommentModel {
  const body = faker.lorem.sentences(bodySentences);
  const newComment: addCommentModel = { body: body };
  return newComment;
}
