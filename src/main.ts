import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnvConfigs } from './config/env.config';
import { setupSwagger } from './config/swagger.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { jaegerTracerInit } from './jaegerTracer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  setupSwagger(app);

  await app.listen(getEnvConfigs().APP_PORT);
  logger.log(
    `Application is running on: ${await app.getUrl()}, port: ${
      getEnvConfigs().APP_PORT
    } `,
  );
}

bootstrap();
if (!!getEnvConfigs().JAEGER_AGENT_HOST) {
  jaegerTracerInit('selector.ai', getEnvConfigs().JAEGER_AGENT_HOST);
}
