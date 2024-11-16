import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { PaymentUpdate } from './payment/payment.update';
import { UserUpdate } from './user/user.update';

@Module({ providers: [BotUpdate, PaymentUpdate, UserUpdate] })
export class BotModule {}
