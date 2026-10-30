import { BASE_URL } from '@_config/env.config';
import { STORAGE_STATE } from '@_pw-config';
import { request } from '@playwright/test';
import * as fs from 'fs';

async function globalSetup(): Promise<void> {
  if (fs.existsSync(STORAGE_STATE)) {
    fs.unlinkSync(STORAGE_STATE);
  }

  // console.log('⚠️ GLOBAL SETUP');
  const requestContext = await request.newContext();
  try {
    await requestContext.get(BASE_URL);
    // const response = await requestContext.get(BASE_URL);
    // console.log('Response ok?', response.ok());
  } catch {
    throw new Error(
      `❌ Failed to connect to ${BASE_URL}
     check if the application is running and the baseUrl is correct`,
    );
  }
}

export default globalSetup;
