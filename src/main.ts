import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CONFIGURATION_KEY, Configuration } from './configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configuration = app
    .get(ConfigService)
    .getOrThrow<Configuration>(CONFIGURATION_KEY);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configuration.swagger.title)
    .setDescription(configuration.swagger.description)
    .setVersion(configuration.swagger.version)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(configuration.swagger.path, app, document);

  await app.listen(configuration.port);
}
void bootstrap();
