import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma.service';
import { RateService } from './rate/rate.service';
import { RouterOSService } from './router/router.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
      middlewares: [session()],
    }),
    ConfigModule.forRoot(),
  ],

  providers: [PrismaService, UserService, RateService, RouterOSService],
})
export class AppModule {}
