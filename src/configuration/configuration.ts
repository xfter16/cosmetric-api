import { registerAs } from '@nestjs/config';

export const CONFIGURATION_KEY = 'configuration';

const configurationFactory = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl: process.env.DATABASE_URL ?? '',
});

export type Configuration = ReturnType<typeof configurationFactory>;

export default registerAs(CONFIGURATION_KEY, configurationFactory);
