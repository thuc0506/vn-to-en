import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';



async function bootstrap() {
  const app = await NestFactory.create(AppModule.forRoot({ db: 0 }));
  app.use(cookieParser());
  // Serve thư mục transcripts tại /transcripts
  // ✅ Thêm header Access-Control-Allow-Origin cho file .vtt
  // app.use('/transcripts', 
  //   express.static('/app/transcripts', {
  //     setHeaders: (res, path) => {
  //       if (path.endsWith('.vtt')) {
  //         res.set('Content-Type', 'text/vtt');
  //       }
  //       res.set('Access-Control-Allow-Origin', '*'); // Fix CORS
  //     }
  //   })
  // );
  
  app.enableCors({ origin: 'http://localhost:8080', credentials: true, });
  await app.listen(5000);
}
bootstrap();
