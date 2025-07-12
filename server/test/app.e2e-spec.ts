import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { Cache } from 'cache-manager';

describe('AppController (e2e)', () => {
  let app: INestApplication;
   let cacheManager: Cache;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

     cacheManager = app.get(CACHE_MANAGER);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should manually set and get cache key', async () => {
    const key = 'custom:test-key';
    const value = { message: 'Hello Redis!' };

    await cacheManager.set(key, value, 60);  // TTL 60 giây
    const cachedValue = await cacheManager.get<typeof value>(key);

    expect(cachedValue).toEqual(value);
  });
});
