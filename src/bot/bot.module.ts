import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { PaymentUpdate } from './payment/payment.update';
import { UserUpdate } from './user/user.update';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { PaymentController } from './payment/payment.controller';
import { RouterOSService } from 'src/router/router.service';
import { RateService } from 'src/rate/rate.service';

@Module({
  providers: [BotUpdate, PaymentUpdate, UserUpdate, UserService, PrismaService, RouterOSService, RateService],
  controllers: [PaymentController],
})
export class BotModule {}
