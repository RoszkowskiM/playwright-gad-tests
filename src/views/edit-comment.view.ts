import { addCommentModel } from '../models/comment.model';
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

  async updateComment(commentData: addCommentModel): Promise<void> {
    await this.bodyInput.fill(commentData.body);
    await this.updateButton.click();
  }
}
