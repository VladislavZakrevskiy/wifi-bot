import { Cron } from '@nestjs/schedule';
import { RouterOSService } from '../router/router.service';
import { UserService } from '../user/user.service';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RateCronService {
  constructor(
    private routerOSService: RouterOSService,
    private userService: UserService,
    private prisma: PrismaService,
    @InjectBot() private bot: Telegraf,
  ) {}

  @Cron(process.env.RATE_CHECK_TIME)
  async check_rate() {
    const users = (await this.userService.getAllUsers()).filter(({ rate }) => rate);

    for (const user of users) {
      const until_date = dayjs(new Date(user.until_date));
      const now_date = dayjs(new Date());
      const days_between = until_date.diff(now_date, 'days') + 1;
      if (days_between === 1 && user.rate.days !== 1) {
        this.bot.telegram.sendMessage(
          user.tg_id,
          `Скоро кончится тариф 🚨🚨🚨
Остался 1 день! Успейте обновить тариф!`,
          {
            reply_markup: {
              inline_keyboard: [[{ web_app: { url: `${process.env.WEB_APP_URL}/ratemarket` }, text: '💵 Купить тариф' }]],
            },
          },
        );
      }
      if (days_between === 3) {
        this.bot.telegram.sendMessage(
          user.tg_id,
          `Скоро кончится тариф 🚨🚨🚨
Осталось 3 дня! Успейте обновить тариф!`,
          {
            reply_markup: {
              inline_keyboard: [[{ web_app: { url: `${process.env.WEB_APP_URL}/ratemarket` }, text: '💵 Купить тариф' }]],
            },
          },
        );
      }
      if (days_between === 0) {
        await this.routerOSService.removeUser(user.username);
        await this.prisma.user.update({
          where: { id: user.id },
          data: { username: user.username, until_date: null, password: null, rate: { disconnect: true } },
        });

        await this.bot.telegram.sendMessage(
          user.tg_id,
          `Закончился тариф 🚨🚨🚨
Приостановлен доступ к WIFI. Чтобы вернуть доступ, купите новый тариф`,
          {
            reply_markup: {
              inline_keyboard: [[{ web_app: { url: `${process.env.WEB_APP_URL}/ratemarket` }, text: '💵 Купить тариф' }]],
            },
          },
        );
      }
    }
  }
}
