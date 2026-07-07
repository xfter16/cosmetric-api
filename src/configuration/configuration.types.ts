export interface SwaggerConfiguration {
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface Configuration {
  port: number;
  nodeEnv: string;
  swagger: SwaggerConfiguration;
}
