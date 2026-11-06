import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { expect, test } from '@_src/merge.fixture';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { addCommentModel } from '@_src/ui/models/comment.model';
import { ArticlePage } from '@_src/ui/pages/article.page';

test.describe('Create, verify and delete comment', () => {
  let articlePageNew: ArticlePage;
  let articleId: string;

  test.beforeEach(
    'Create an article',
    async ({ articlesRequestLoggedIn, articlePage }) => {
      const responseArticle = await createArticleWithApi(
        articlesRequestLoggedIn,
      );

      const article = await responseArticle.json();
      articleId = article.id;

      articlePageNew = await articlePage.goToId(articleId);
    },
  );

  test(
    'operate on comments',
    {
      tag: ['@GAD-R05-01', '@GAD-R05-02', '@logged'],
    },
    async ({}) => {
      const newCommentData = prepareRandomComment();

      await test.step('user can create new comment', async () => {
        // Arrange
        const expectedAddCommentViewHeader = 'Add New Comment';
        const expectedCommentCreatedAlertText = 'Comment was created';

        // Act
        const addCommentView = await articlePageNew.clickAddCommentButton();
        await expect.soft(addCommentView.addNewHeader).toBeVisible();
        await expect
          .soft(addCommentView.addNewHeader)
          .toHaveText(expectedAddCommentViewHeader);
        articlePageNew = await addCommentView.createComment(newCommentData);

        // Assert
        await expect
          .soft(articlePageNew.alertPopup)
          .toHaveText(expectedCommentCreatedAlertText);
      });

      let commentPage =
        await test.step('user can verify new comment', async () => {
          // Act
          const articleComment = articlePageNew.getArticleComment(
            newCommentData.body,
          );

          // Assert
          await expect(articleComment.body).toHaveText(newCommentData.body);
          const commentPage =
            await articlePageNew.clickCommentLink(articleComment);
          await expect(commentPage.commentBody).toHaveText(newCommentData.body);

          return commentPage;
        });

      let editCommentData: addCommentModel;

      await test.step('user can update comment', async () => {
        // Arrange
        editCommentData = prepareRandomComment();
        const expectedCommentUpdatedAlertText = 'Comment was updated';

        // Act
        const editCommentView = await commentPage.clickEditComment();
        commentPage = await editCommentView.updateComment(editCommentData);

        // Assert
        await expect
          .soft(commentPage.alertPopup)
          .toHaveText(expectedCommentUpdatedAlertText);
        await expect(commentPage.commentBody).toHaveText(editCommentData.body);
      });

      await test.step('user can verify updated comment on article page', async () => {
        // Act
        articlePageNew = await commentPage.clickReturnToArticleLink();
        const updatedArticleComment = articlePageNew.getArticleComment(
          editCommentData.body,
        );

        // Assert
        await expect(updatedArticleComment.body).toHaveText(
          editCommentData.body,
        );
      });
    },
  );

  test(
    'user can add more than one comment to article',
    {
      tag: ['@GAD-R05-03', '@logged'],
    },
    async ({}) => {
      await test.step('user can create first comment', async () => {
        // Arrange
        const newCommentData = prepareRandomComment();
        const expectedCommentCreatedAlertText = 'Comment was created';

        // Act
        const addCommentView = await articlePageNew.clickAddCommentButton();
        articlePageNew = await addCommentView.createComment(newCommentData);

        // Assert
        await expect
          .soft(articlePageNew.alertPopup)
          .toHaveText(expectedCommentCreatedAlertText);
      });

      await test.step('user can create and verify second comment', async () => {
        const secondCommentBody =
          await test.step('create comment', async () => {
            const secondCommentData = prepareRandomComment();
            const addCommentView = await articlePageNew.clickAddCommentButton();
            articlePageNew =
              await addCommentView.createComment(secondCommentData);
            return secondCommentData.body;
          });

        await test.step('verify comment', async () => {
          const articleComment =
            articlePageNew.getArticleComment(secondCommentBody);
          await expect(articleComment.body).toHaveText(secondCommentBody);
          const commentPage =
            await articlePageNew.clickCommentLink(articleComment);
          await expect(commentPage.commentBody).toHaveText(secondCommentBody);
        });
      });
    },
  );
});
