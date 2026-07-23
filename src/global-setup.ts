import { STORAGE_STATE } from '../playwright.config';
import * as fs from 'fs';

async function globalSetup(): Promise<void> {
  if (fs.existsSync(STORAGE_STATE)) {
    fs.unlinkSync(STORAGE_STATE);
  }
  // console.log('GLOBAL SETUP');
}

export default globalSetup;
