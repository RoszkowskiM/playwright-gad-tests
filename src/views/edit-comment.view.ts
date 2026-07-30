import { addCommentModel } from '@_src/models/comment.model';
import { CommentPage } from '@_src/pages/comment.page';
import { Locator, Page } from '@playwright/test';

export class EditCommentView {
  bodyInput: Locator;
  updateButton: Locator;
  cancelButton: Locator;

  constructor(private page: Page) {
    this.bodyInput = this.page.getByTestId('body-input');
    this.updateButton = this.page.getByTestId('update-button');
    this.cancelButton = this.page.locator('#Cancel');
  }

  async updateComment(commentData: addCommentModel): Promise<CommentPage> {
    await this.bodyInput.fill(commentData.body);
    await this.updateButton.click();

    return new CommentPage(this.page);
  }
}
