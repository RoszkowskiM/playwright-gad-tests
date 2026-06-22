import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  url = '/login/';
  constructor(page: Page) {
    super(page);
  }

  async login(email: string, password: string): Promise<void> {
    await this.page
      .getByRole('textbox', { name: 'Enter User Email' })
      .fill(email);
    await this.page
      .getByRole('textbox', { name: 'Enter Password' })
      .fill(password);
    await this.page.getByRole('button', { name: 'LogIn' }).click();
  }
}
