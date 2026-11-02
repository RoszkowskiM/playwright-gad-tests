import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test as health } from '@_src/merge.fixture';

health('health check', async ({ request }) => {
  // Arrange
  const expectedStatus = 'OK';

  // Act
  const response = await request.get(apiUrls.healthUrl);
  const responseJson = await response.json();

  // Assert
  expect(responseJson.status).toBe(expectedStatus);
});
