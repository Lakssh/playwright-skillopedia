// src/core/helpers/ConfigHelper.ts
import * as dotenv from 'dotenv';
import * as path from 'path';

export class ConfigHelper {
 
   constructor() {
    const env = process.env.TEST_ENV || 'dev';
    const envPath = path.resolve(__dirname, `../../../config/${env}.env`);
    dotenv.config({ path: envPath });
  }
  
  
getEnvVariable(key: string, defaultValue: string = ''): string {
    return process.env[key] || defaultValue;
}

}