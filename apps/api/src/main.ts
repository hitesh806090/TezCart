import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('TezCart API')
    .setDescription('The TezCart Multi-Tenant Commerce Platform API description')
    .setVersion('1.0')
    .addTag('Tenant Configuration') // Add the tag used in the controller
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Setup Swagger at /api endpoint

  await app.listen(3000);
}
bootstrap();