import { registerAs } from '@nestjs/config';
import { Configuration } from './configuration.types';

export const CONFIGURATION_KEY = 'configuration';

export default registerAs(CONFIGURATION_KEY, (): Configuration => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  swagger: {
    title: process.env.SWAGGER_TITLE ?? 'API',
    description: process.env.SWAGGER_DESCRIPTION ?? 'API documentation',
    version: process.env.SWAGGER_VERSION ?? '1.0',
    path: process.env.SWAGGER_PATH ?? 'docs',
  },
}));
