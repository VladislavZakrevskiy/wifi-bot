import { Cron } from '@nestjs/schedule';
import { RouterOSService } from '../router/router.service';
import { UserService } from '../user/user.service';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { getDaysBetweenDates } from 'src/core/helpers/getDaysBetweenDays';
export class RateCronService {
  constructor(
    private routerOSService: RouterOSService,
    private userService: UserService,
    @InjectBot() private bot: Telegraf,
  ) {}

  @Cron(process.env.RATE_CHECK_TIME)
  async check_rate() {
    const users = await this.userService.getAllUsers();

    for (const user of users) {
      const until_date = new Date(user.until_date);
      const now_date = new Date();
      const days_between = getDaysBetweenDates(until_date, now_date);
      if (days_between === 1) {
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
        this.bot.telegram.sendMessage(
          user.tg_id,
          `Закончился тариф 🚨🚨🚨
Приостановлен доступ к WIFI. Чтобы вернуть доступ, купите новый тариф`,
          {
            reply_markup: {
              inline_keyboard: [[{ web_app: { url: `${process.env.WEB_APP_URL}/ratemarket` }, text: '💵 Купить тариф' }]],
            },
          },
        );

        this.routerOSService.removeUser(user.username);
        this.userService.updateUser({
          id: user.id,
          username: user.username,
          until_date: null,
          rate_id: null,
          password: null,
        });
      }
    }
  }
}
