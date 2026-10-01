import { CommentPayload } from '../models/comment-payload.api.model';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';

export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment();
  const commentData = {
    article_id: articleId,
    body: randomCommentData.body,
    date: '2026-09-16T07:18:47.823Z',
  };
  return commentData;
}
