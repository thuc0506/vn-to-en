import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { DynamicModule, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { dataSourceOptions } from 'db/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({})
export class AppModule {
  static forRoot(options: { db: number }): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(dataSourceOptions),
        CacheModule.registerAsync({
          isGlobal: true,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            store: redisStore,
            host: configService.get('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            ttl: 0,
            db: options.db,
          }),
        }),
        AuthModule,
      ],
      controllers: [],
      providers: [
        // { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
      ],

    };
  }
}