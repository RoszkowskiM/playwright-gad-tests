import { expect, test } from '@_src/fixtures/merge.fixture';
import { LoginUserModel } from '@_src/models/user.model';
import { testUser1 } from '@_src/test-data/user.data';

test.describe('Verify login', () => {
  test(
    'login with correct credentials',
    {
      tag: ['@GAD-R02-01'],
    },
    async ({ loginPage }) => {
      // Arrange
      const expectedWelcomeTitle = 'Welcome';

      // Act
      const welcomePage = await loginPage.login(testUser1);

      const title = await welcomePage.getTitle();

      // Assert
      expect(title).toContain(expectedWelcomeTitle);
    },
  );

  test(
    'reject login with incorrect password',
    {
      tag: ['@GAD-R02-01'],
    },
    async ({ loginPage }) => {
      // Arrange
      const expectedLoginTitle = 'Login';
      const loginUserData: LoginUserModel = {
        userEmail: testUser1.userEmail,
        userPassword: 'incorrectPassword',
      };

      // Act
      await loginPage.login(loginUserData);

      const title = await loginPage.getTitle();

      // Assert
      await expect
        .soft(loginPage.loginError)
        .toHaveText('Invalid username or password');
      expect.soft(title).toContain(expectedLoginTitle);
    },
  );
});
