import { Rate, User } from '@prisma/client';
import { SessionContext } from '../types/Scenes';

export const getProfileText = (ctx: SessionContext, user: User & { rate: Rate }) => {
  let profileText = '';
  profileText += `<b>Имя:</b> ${ctx.from.first_name}\n`;
  if (ctx.from.last_name) profileText += `<b>Фамилия:</b> ${ctx.from.last_name}\n`;
  profileText += `<b>Username</b>: ${user.username}\n`;
  if (user.rate_id) {
    profileText += `<b>Пароль:</b> ${user.password}
<b>Тариф:</b> ${user.rate.name}
<b>Оканчивается:</b> ${user.until_date.toISOString().split('T')[0]}
`;
  } else {
    profileText += `<b>Тариф</b>: Нет`;
  }

  return profileText;
};
