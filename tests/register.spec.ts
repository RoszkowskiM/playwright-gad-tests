import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page.';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify registration', () => {
  test(
    'register and login with correct data',
    {
      tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03'],
    },
    async ({ page }) => {
      // Arrange
      await page.goto('/register.html');
      const userFirstName = 'Janusz';
      const userLastName = 'Tytanowy';
      const userEmail = `tytjan${new Date().getTime()}@test.pl`;
      const userPassword = '1111';
      const alertPopupText = 'User created';

      const registerPage = new RegisterPage(page);

      // Act
      await registerPage.goto();
      await registerPage.register(
        userFirstName,
        userLastName,
        userEmail,
        userPassword,
      );

      // Assert
      await expect(registerPage.alertPopup).toHaveText(alertPopupText);

      const loginPage = new LoginPage(page);
      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.title();
      expect(titleLogin).toContain('Login');

      // Assert
      await loginPage.login(userEmail, userPassword);

      const welcomePage = new WelcomePage(page);
      const titleWelcome = await welcomePage.title();
      expect(titleWelcome).toContain('Welcome');
    },
  );
});
