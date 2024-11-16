import { Rate } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Ctx, On, Update } from 'nestjs-telegraf';
import { SessionSceneContext } from 'src/types/Scenes';
import { Context } from 'telegraf';

interface WebAppData {
  paymentMethod: 'stars' | 'tg_native';
  purchase: Rate;
}

@Update()
export class PaymentUpdate {
  async sendPaymentByStars(ctx: SessionSceneContext, webapp_data: WebAppData) {
    const { purchase } = webapp_data;
    await ctx.replyWithInvoice({
      currency: 'XTR',
      description: purchase.description,
      prices: [{ amount: purchase.price * 0.2, label: purchase.name }],
      provider_token: process.env.PAYMENT_TOKEN,
      title: purchase.name,
      photo_height: 1024,
      photo_width: 1024,
      photo_url: 'https://cdn2.iconfinder.com/data/icons/computer-24/207/technology-computer_49-1024.png', // process.env.IMAGE_BUCKET + purchase.image_url,
      payload: randomUUID(),
    });
  }

  async sendInvoice(ctx: SessionSceneContext, webapp_data: WebAppData) {
    const { purchase } = webapp_data;
    await ctx.replyWithInvoice({
      currency: 'RUB',
      description: purchase.description,
      prices: [{ amount: purchase.price * 100, label: purchase.name }],
      provider_token: process.env.PAYMENT_TOKEN,
      title: purchase.name,
      photo_height: 1024,
      photo_width: 1024,
      photo_url: 'https://cdn2.iconfinder.com/data/icons/computer-24/207/technology-computer_49-1024.png', // process.env.IMAGE_BUCKET + purchase.image_url,
      payload: randomUUID(),
    });
  }

  @On('web_app_data')
  async getPaymentMethod(@Ctx() ctx: SessionSceneContext) {
    const webapp_data = ctx.webAppData.data.json<WebAppData>();
    if (webapp_data) {
      const { paymentMethod, purchase } = webapp_data;
      console.log(paymentMethod);
      ctx.session.webapp_data = { method: paymentMethod, purchase };
      switch (webapp_data.paymentMethod) {
        case 'stars':
          this.sendPaymentByStars(ctx, webapp_data);
          break;
        case 'tg_native':
          this.sendInvoice(ctx, webapp_data);
          break;
      }
    }
  }

  @On('pre_checkout_query')
  async preCheckoutQuery(@Ctx() ctx: Context) {
    await ctx.answerPreCheckoutQuery(true);
  }

  @On('successful_payment')
  async onSuccessfulPayment(@Ctx() ctx: SessionSceneContext) {
    const { method, purchase } = ctx.session.webapp_data;
    await ctx.replyWithPhoto(
      {
        url: 'https://cdn2.iconfinder.com/data/icons/computer-24/207/technology-computer_49-1024.png', // process.env.IMAGE_BUCKET + purchase.image_url
      },
      {
        caption: `Успешная покупка!
<b>Тариф:</b> ${purchase.name}
<b>Цена:</b> ${purchase.price * 0.2} ${method === 'stars' ? '⭐️' : 'Рублей'}`,
        parse_mode: 'HTML',
      },
    );

    // TODO Работа с роутером
  }
}
