import { randomUserData } from '../src/factories/user.factory';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
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
      const alertPopupText = 'User created';

      const registerUserData = randomUserData();

      const registerPage = new RegisterPage(page);

      // Act
      await registerPage.goto();
      await registerPage.register(registerUserData);

      // Assert
      await expect(registerPage.alertPopup).toHaveText(alertPopupText);

      const loginPage = new LoginPage(page);
      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.title();
      expect(titleLogin).toContain('Login');

      // Assert
      await loginPage.login({
        userEmail: registerUserData.userEmail,
        userPassword: registerUserData.userPassword,
      });

      const welcomePage = new WelcomePage(page);
      const titleWelcome = await welcomePage.title();
      expect(titleWelcome).toContain('Welcome');
    },
  );

  test(
    'not register with invalid email address',
    {
      tag: ['@GAD-R03-04'],
    },
    async ({ page }) => {
      // Arrange
      const expectedErrorText = 'Please provide a valid email address';

      const registerUserData = randomUserData();
      registerUserData.userEmail = 'xxx';

      const registerPage = new RegisterPage(page);

      // Act
      await registerPage.goto();
      await registerPage.register(registerUserData);

      // Assert
      await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
    },
  );

  test(
    'not register with empty email address field',
    {
      tag: ['@GAD-R03-04'],
    },
    async ({ page }) => {
      // Arrange
      const expectedErrorText = 'This field is required';
      const registerPage = new RegisterPage(page);
      const registerUserData = randomUserData();

      // Act
      await registerPage.goto();
      await registerPage.userFirstNameInput.fill(
        registerUserData.userFirstName,
      );
      await registerPage.userLastNameInput.fill(registerUserData.userLastName);
      await registerPage.userPasswordInput.fill(registerUserData.userPassword);
      await registerPage.registerButton.click();

      // Assert
      await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
    },
  );
});
