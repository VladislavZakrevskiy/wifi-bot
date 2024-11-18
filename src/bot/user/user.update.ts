import { Command, Ctx, Update } from 'nestjs-telegraf';
import { getProfileText } from 'src/core/helpers/getProfileText';
import { getTelegramImage } from 'src/core/helpers/getTelegramImage';
import { SessionContext } from 'src/core/types/Scenes';
import { UserService } from 'src/user/user.service';

@Update()
export class UserUpdate {
  constructor(private userService: UserService) {}

  @Command('profile')
  async getProfile(@Ctx() ctx: SessionContext) {
    const user = await this.userService.getUserByProps({ tg_id: String(ctx.from.id) });
    const profileImage = await getTelegramImage(ctx, ctx.from.id);

    await ctx.replyWithPhoto(
      { url: profileImage.toString() },
      {
        caption: getProfileText(ctx, user),
        parse_mode: 'HTML',
      },
    );
  }
}
