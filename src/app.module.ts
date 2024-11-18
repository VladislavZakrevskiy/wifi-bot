import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RateModule } from './rate/rate.module';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from './user/user.module';
import { BotModule } from './bot/bot.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
      middlewares: [session()],
    }),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../public'),
    }),
    RateModule,
    UserModule,
    HttpModule,
    BotModule,
  ],

  providers: [],
})
export class AppModule {}
