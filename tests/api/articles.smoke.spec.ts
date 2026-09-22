import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe(
  'Verify articles API endpoint',
  {
    tag: ['@GAD-R08-01', '@smoke'],
  },
  () => {
    test.describe('Verify each condition in separate test', () => {
      test('GET articles returns status code 200', async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const articlesUrl = '/api/articles';

        // Act
        const response = await request.get(articlesUrl);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
      });

      test(
        'GET articles returns at least one article',
        {
          tag: ['@predefined_data'],
        },
        async ({ request }) => {
          // Arrange
          const expectedMinArticlesCount = 1;
          const articlesUrl = '/api/articles';

          // Act
          const response = await request.get(articlesUrl);
          const responseJson = await response.json();

          // Assert
          expect(responseJson.length).toBeGreaterThanOrEqual(
            expectedMinArticlesCount,
          );
        },
      );

      test(
        'GET articles returns article object',
        {
          tag: ['@predefined_data'],
        },
        async ({ request }) => {
          // Arrange
          const articlesUrl = '/api/articles';
          const expectedRequiredFields = [
            'id',
            'user_id',
            'title',
            'body',
            'date',
            'image',
          ];

          // Act
          const response = await request.get(articlesUrl);
          const responseJson = await response.json();
          const article = responseJson[0];

          // Assert
          expectedRequiredFields.forEach((key) => {
            expect.soft(article).toHaveProperty(key);
          });
        },
      );
    });

    test(
      'GET articles returns an object with required fields',
      {
        tag: ['@predefined_data'],
      },
      async ({ request }) => {
        // Arrange
        const articlesUrl = '/api/articles';
        const response = await request.get(articlesUrl);
        const responseJson = await response.json();

        await test.step('GET articles returns status code 200', async () => {
          const expectedStatusCode = 200;
          expect(response.status()).toBe(expectedStatusCode);
        });

        await test.step('GET articles returns at least one article', async () => {
          const expectedMinArticlesCount = 1;
          expect(responseJson.length).toBeGreaterThanOrEqual(
            expectedMinArticlesCount,
          );
        });

        const expectedRequiredFields = [
          'id',
          'user_id',
          'title',
          'body',
          'date',
          'image',
        ];
        const article = responseJson[0];
        expectedRequiredFields.forEach(async (key) => {
          await test.step(`response object contains required field: ${key}`, async () => {
            expect.soft(article).toHaveProperty(key);
          });
        });
      },
    );
  },
);
