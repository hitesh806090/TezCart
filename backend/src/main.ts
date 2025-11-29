import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for frontend
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');

  // Ensure admin user exists
  const authService = app.get(AuthService);
  await authService.ensureAdminUser();
}
bootstrap();
