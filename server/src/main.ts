import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule.forRoot({ db: 0 }));
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
  
  app.enableCors({ origin: 'http://localhost:8080' });
  await app.listen(5000);
}
bootstrap();
