import { MainMenuComponent } from '../components/main-menu.component';
import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  mainMenu = new MainMenuComponent(this.page);
  commentBody = this.page.getByTestId('comment-body');
  editCommentIcon = this.page.getByTestId('edit');
  returnToArticleLink = this.page.getByTestId('return');

  constructor(page: Page) {
    super(page);
  }

  async editComment(): Promise<void> {
    this.editCommentIcon.click();
  }
}
