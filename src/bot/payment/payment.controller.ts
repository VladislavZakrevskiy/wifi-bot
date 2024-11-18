import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Rate } from '@prisma/client';
import { randomUUID } from 'crypto';
import { InjectBot } from 'nestjs-telegraf';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth.decorator';
import { PrismaService } from 'src/prisma.service';
import { Telegraf } from 'telegraf';

interface WebAppData {
  paymentMethod: 'stars' | 'tg_native';
  purchase: Rate;
  user_id: string;
}

@Controller('tg')
export class PaymentController {
  constructor(
    @InjectBot() private bot: Telegraf,
    private prisma: PrismaService,
  ) {}

  async sendPaymentByStars(webapp_data: WebAppData) {
    const { purchase } = webapp_data;
    await this.bot.telegram.sendInvoice(webapp_data.user_id, {
      currency: 'XTR',
      description: purchase.description,
      prices: [{ amount: purchase.price * 0.2, label: purchase.name }],
      provider_token: process.env.PAYMENT_TOKEN,
      title: purchase.name,
      photo_height: 1024,
      photo_width: 1024,
      photo_url: 'https://cdn2.iconfinder.com/data/icons/computer-24/207/technology-computer_49-1024.png', // process.env.IMAGE_BUCKET + purchase.image_url,
      payload: `${randomUUID()}/separator/${purchase.id}`,
    });
  }

  async sendInvoice(webapp_data: WebAppData) {
    const { purchase } = webapp_data;
    await this.bot.telegram.sendInvoice(webapp_data.user_id, {
      currency: 'RUB',
      description: purchase.description,
      prices: [{ amount: purchase.price * 100, label: purchase.name }],
      provider_token: process.env.PAYMENT_TOKEN,
      title: purchase.name,
      photo_height: 1024,
      photo_width: 1024,
      photo_url: 'https://cdn2.iconfinder.com/data/icons/computer-24/207/technology-computer_49-1024.png', // process.env.IMAGE_BUCKET + purchase.image_url,
      payload: `${randomUUID()}/separator/${purchase.id}`,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/invoice')
  async sendInvoiceToUser(@Body() body: WebAppData) {
    if (body) {
      switch (body.paymentMethod) {
        case 'stars':
          this.sendPaymentByStars(body);
          break;
        case 'tg_native':
          this.sendInvoice(body);
          break;
      }
      const user = await this.prisma.user.findUnique({
        where: { tg_id: String(body.user_id) },
        include: { refresh_token: true },
      });
      if (user.refresh_token) {
        await this.prisma.user.update({
          where: { tg_id: String(body.user_id) },
          data: { ...user, refresh_token: { delete: true } },
        });
      }
    }
  }
}
