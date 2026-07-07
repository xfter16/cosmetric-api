import { registerAs } from '@nestjs/config';
import { Configuration } from './configuration.types';

export const CONFIGURATION_KEY = 'configuration';

export default registerAs(CONFIGURATION_KEY, (): Configuration => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
}));
