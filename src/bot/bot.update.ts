import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';

@Update()
export class BotUpdate {
  constructor() {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(
      `WIFI Bot - безопасная работа в интернете 

💸 Тарифы от 100 рублей
⏫ Высокая скорость подключения
🔓 Высокий уровень шифрования данных
🙅 Не сохраняет историю действий пользователей
🤝 Круглосуточная техническая поддержка`,
      Markup.keyboard([[Markup.button.webApp('💵 Купить тариф', process.env.WEB_APP_URL + '/ratemarket')]])
        .resize()
        .oneTime(),
    );
  }
}
