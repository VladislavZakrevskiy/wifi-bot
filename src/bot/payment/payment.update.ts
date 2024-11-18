import { Ctx, On, Update } from 'nestjs-telegraf';
import { SessionSceneContext } from 'src/core/types/Scenes';
import { Context } from 'telegraf';
import { RouterOSService } from '../../router/router.service';
import { UserService } from 'src/user/user.service';
import { randomUUID } from 'crypto';
import { SuccessfulPayment } from 'src/core/types/SuccessfulPayment';
import * as dayjs from 'dayjs';
import { RateService } from 'src/rate/rate.service';

@Update()
export class PaymentUpdate {
  constructor(
    private routerOSService: RouterOSService,
    private userService: UserService,
    private rateService: RateService,
  ) {}

  @On('pre_checkout_query')
  async preCheckoutQuery(@Ctx() ctx: Context) {
    await ctx.answerPreCheckoutQuery(true);
  }

  @On('successful_payment')
  async onSuccessfulPayment(@Ctx() ctx: SessionSceneContext & { message?: { successful_payment?: SuccessfulPayment } }) {
    const user = await this.userService.getUserByProps({ tg_id: String(ctx.from.id) });
    const rate_id = ctx.message.successful_payment.invoice_payload.split('/separator/')[1];
    const rate = await this.rateService.getRateById(rate_id);
    const password = randomUUID().split('-').join('');
    console.log(dayjs().add(rate.days, 'days').toDate(), dayjs().toDate());

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.userService.updateUser({
      ...user,
      rate_id: rate.id,
      password,
      until_date: dayjs().add(rate.days, 'days').toDate(),
    });
    await this.routerOSService.addUser(user.username, password);

    await ctx.reply(
      `Успешная покупка!

<b>Username</b>: ${user.username}
<b>Password</b>: ${password}`,
      { parse_mode: 'HTML' },
    );
  }
}
