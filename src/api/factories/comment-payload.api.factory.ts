import { CommentPayload } from '../models/comment-payload.api.model';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';

export function prepareCommentPayload(articleId: string): CommentPayload {
  const randomCommentData = prepareRandomComment();
  const commentData = {
    article_id: articleId,
    body: randomCommentData.body,
    date: new Date().toISOString(),
  };
  return commentData;
}
