import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.forRoot({ db: 0 }));

  app.use(cookieParser());

  // ✅ Serve audio files
  app.use(
    '/uploads/audio',
    express.static(join(__dirname, '..', '..', 'uploads', 'audio'), {
      setHeaders: (res, path) => {
        if (path.endsWith('.mp3')) {
          res.set('Content-Type', 'audio/mpeg');
        } else if (path.endsWith('.wav')) {
          res.set('Content-Type', 'audio/wav');
        } else if (path.endsWith('.ogg')) {
          res.set('Content-Type', 'audio/ogg');
        } else if (path.endsWith('.m4a')) {
          res.set('Content-Type', 'audio/m4a');
        }
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Accept-Ranges', 'bytes'); // Cho phép tua
      },
    }),
  );

  // ✅ Serve transcripts (cho cả audio & video transcript)
  app.use(
    '/uploads/transcripts',
    express.static(join(__dirname, '..', '..', 'uploads', 'transcripts'), {
      setHeaders: (res, path) => {
        if (path.endsWith('.txt')) {
          res.set('Content-Type', 'text/plain; charset=utf-8');
        } else if (path.endsWith('.vtt')) {
          res.set('Content-Type', 'text/vtt; charset=utf-8');
        }
        res.set('Access-Control-Allow-Origin', '*');
      },
    }),
  );

  // ✅ Cho phép frontend ở localhost:8080 truy cập API
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  await app.listen(5000);
}
bootstrap();
