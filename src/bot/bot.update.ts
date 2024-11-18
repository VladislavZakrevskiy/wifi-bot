import { Ctx, Hears, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { UserService } from '../user/user.service';

@Update()
export class BotUpdate {
  constructor(private userService: UserService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    const candidate = await this.userService.getUserByProps({ tg_id: String(ctx.from.id) });
    if (!candidate) {
      await this.userService.createUser({
        tg_id: String(ctx.from.id),
        username: ctx.from.username ? ctx.from.username : ctx.from.first_name,
      });
    }

    await ctx.reply(
      `WIFI Bot - безопасная работа в интернете 

💸 Тарифы от 100 рублей
⏫ Высокая скорость подключения
🔓 Высокий уровень шифрования данных
🙅 Не сохраняет историю действий пользователей
🤝 Круглосуточная техническая поддержка`,
      Markup.keyboard([[Markup.button.text('💵 Купить тариф')]])
        .resize()
        .oneTime(),
    );
  }

  @Hears('💵 Купить тариф')
  async buyRate(@Ctx() ctx: Context) {
    await ctx.reply('Чтобы открыть наш магазин тарифов нажмите кнопку ниже', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '💵 Купить тариф',
              web_app: { url: `${process.env.WEB_APP_URL}/ratemarket` },
            },
          ],
        ],
      },
    });
  }
}
