import { randomUserData } from '../src/factories/user.factory';
import { RegisterUser } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify registration', () => {
  let registerPage: RegisterPage;
  let registerUserData: RegisterUser;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    registerUserData = randomUserData();
    await registerPage.goto();
  });

  test(
    'register and login with correct data',
    {
      tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03'],
    },
    async ({ page }) => {
      // Arrange
      const alertPopupText = 'User created';

      const loginPage = new LoginPage(page);
      const welcomePage = new WelcomePage(page);

      // Act
      await registerPage.register(registerUserData);

      // Assert
      await expect(registerPage.alertPopup).toHaveText(alertPopupText);

      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.title();
      expect(titleLogin).toContain('Login');

      // Assert test login
      await loginPage.login({
        userEmail: registerUserData.userEmail,
        userPassword: registerUserData.userPassword,
      });

      const titleWelcome = await welcomePage.title();
      expect(titleWelcome).toContain('Welcome');
    },
  );

  test(
    'not register with invalid email address',
    {
      tag: ['@GAD-R03-04'],
    },
    async () => {
      // Arrange
      const expectedErrorText = 'Please provide a valid email address';
      registerUserData.userEmail = 'xxx';

      // Act
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
    async () => {
      // Arrange
      const expectedErrorText = 'This field is required';

      // Act
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
