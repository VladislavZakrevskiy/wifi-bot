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

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
      middlewares: [session()],
    }),
    ConfigModule.forRoot(),
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
