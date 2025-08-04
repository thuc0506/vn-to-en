import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path'; // ⚠️ THIẾU cái này

async function bootstrap() {
  const app = await NestFactory.create(AppModule.forRoot({ db: 0 }));

  app.use(cookieParser());

  // ✅ Serve thư mục tmp/transcripts tại /transcripts và fix MIME + CORS
  app.use(
    '/transcripts',
   express.static(join(__dirname, '..', '..', 'tmp', 'transcripts'), {
      setHeaders: (res, path) => {
        if (path.endsWith('.vtt')) {
          res.set('Content-Type', 'text/vtt');
        }
        res.set('Access-Control-Allow-Origin', '*'); // Cho phép frontend truy cập
      },
    }),
  );

  // Cho phép frontend ở localhost:8080 truy cập API
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  await app.listen(5000);
}
bootstrap();
