import { RegisterUser } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { faker } from '@faker-js/faker/locale/en';
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

      const registerUserData: RegisterUser = {
        userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
        userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
        // zastępuje każdy znak niczym (^ = nie)(g = wykonaj dla wszystkich wystąpień)
        userEmail: '',
        userPassword: faker.internet.password(),
      };

      registerUserData.userEmail = faker.internet.email({
        firstName: registerUserData.userFirstName,
        lastName: registerUserData.userLastName,
      });

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

      const registerUserData: RegisterUser = {
        userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
        userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
        userEmail: 'xxx',
        userPassword: faker.internet.password(),
      };

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

      // Act
      await registerPage.goto();
      await registerPage.userFirstNameInput.fill(
        faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      );
      await registerPage.userLastNameInput.fill(
        faker.person.lastName().replace(/[^A-Za-z]/g, ''),
      );
      await registerPage.userPasswordInput.fill(faker.internet.password());
      await registerPage.registerButton.click();

      // Assert
      await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
    },
  );
});
