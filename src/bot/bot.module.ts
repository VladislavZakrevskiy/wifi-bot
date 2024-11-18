import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { PaymentUpdate } from './payment/payment.update';
import { UserUpdate } from './user/user.update';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { PaymentController } from './payment/payment.controller';

@Module({ providers: [BotUpdate, PaymentUpdate, UserUpdate, UserService, PrismaService], controllers: [PaymentController] })
export class BotModule {}
