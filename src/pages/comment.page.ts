import { MainMenuComponent } from '@_src/components/main-menu.component';
import { ArticlePage } from '@_src/pages/article.page';
import { BasePage } from '@_src/pages/base.page';
import { EditCommentView } from '@_src/views/edit-comment.view';
import { Page } from '@playwright/test';

export class CommentPage extends BasePage {
  url = '/comment.html';
  mainMenu = new MainMenuComponent(this.page);
  commentBody = this.page.getByTestId('comment-body');
  editCommentIcon = this.page.getByTestId('edit');
  returnToArticleLink = this.page.getByTestId('return');
  alertPopup = this.page.getByTestId('alert-popup');

  constructor(page: Page) {
    super(page);
  }

  async clickEditComment(): Promise<EditCommentView> {
    this.editCommentIcon.click();
    return new EditCommentView(this.page);
  }

  async clickReturnToArticleLink(): Promise<ArticlePage> {
    this.returnToArticleLink.click();
    return new ArticlePage(this.page);
  }
}
