import { requestObjectTest } from '@_src/api/fixtures/request-object.fixture';
import { articleTest } from '@_src/ui/fixtures/article.fixture';
import { pageObjectTest } from '@_src/ui/fixtures/page-object.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(pageObjectTest, articleTest, requestObjectTest);

export { expect } from '@playwright/test';
