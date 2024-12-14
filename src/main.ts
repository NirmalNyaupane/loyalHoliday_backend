import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { PasswordRemoverInterceptor } from './interceptors/password-remover.interceptor';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.use(helmet());

  //remove password from response
  app.useGlobalInterceptors(new PasswordRemoverInterceptor());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('loyal holiday')
    .setDescription('This is a api for loyal holiday')
    .setVersion('1.0')
    .addTag('loyalHoliday')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`server started at 
       'localhost:${process.env.PORT ?? 3000}
      `);
  });
}
bootstrap();
