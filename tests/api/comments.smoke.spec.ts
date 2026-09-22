import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe(
  'Verify comments API endpoint',
  {
    tag: ['@GAD-R08-02', '@smoke'],
  },
  () => {
    test.describe('Verify each condition in separate test', () => {
      test('GET comments returns status code 200', async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const commentsUrl = '/api/comments';

        // Act
        const response = await request.get(commentsUrl);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
      });

      test(
        'GET comments returns at least one comment',
        {
          tag: ['@predefined_data'],
        },
        async ({ request }) => {
          // Arrange
          const expectedMinCommentsCount = 1;
          const commentsUrl = '/api/comments';

          // Act
          const response = await request.get(commentsUrl);
          const responseJson = await response.json();

          // Assert
          expect(responseJson.length).toBeGreaterThanOrEqual(
            expectedMinCommentsCount,
          );
        },
      );

      test(
        'GET comments returns comment object',
        {
          tag: ['@GAD-R08-02', '@predefined_data'],
        },
        async ({ request }) => {
          // Arrange
          const commentsUrl = '/api/comments';
          const expectedRequiredFields = [
            'id',
            'article_id',
            'user_id',
            'body',
            'date',
          ];

          // Act
          const response = await request.get(commentsUrl);
          const responseJson = await response.json();
          const comment = responseJson[0];

          // Assert
          expectedRequiredFields.forEach((key) => {
            expect
              .soft(comment, `response object contains required field: ${key}`)
              .toHaveProperty(key);
          });
        },
      );
    });

    test(
      'GET comments returns an object with required fields',
      {
        tag: ['@predefined_data'],
      },
      async ({ request }) => {
        // Arrange
        const commentsUrl = '/api/comments';
        const response = await request.get(commentsUrl);
        const responseJson = await response.json();

        await test.step('GET comments returns status code 200', async () => {
          const expectedStatusCode = 200;
          expect(response.status()).toBe(expectedStatusCode);
        });

        await test.step('GET comments returns at least one comment', async () => {
          const expectedMinCommentsCount = 1;
          expect(responseJson.length).toBeGreaterThanOrEqual(
            expectedMinCommentsCount,
          );
        });

        const expectedRequiredFields = [
          'id',
          'article_id',
          'user_id',
          'body',
          'date',
        ];
        const comment = responseJson[0];
        expectedRequiredFields.forEach(async (key) => {
          await test.step(`response object contains required field: ${key}`, async () => {
            expect.soft(comment).toHaveProperty(key);
          });
        });
      },
    );
  },
);
