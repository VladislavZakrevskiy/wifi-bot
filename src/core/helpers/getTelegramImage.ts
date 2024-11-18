import { SessionContext } from '../types/Scenes';

export const getTelegramImage = async (ctx: SessionContext, tg_user_id: number) => {
  const photo_file_id = (await ctx.telegram.getUserProfilePhotos(tg_user_id, 0, 1)).photos?.[0]?.[1].file_id;
  if (!photo_file_id) {
    return null;
  }
  const photo_url = await ctx.telegram.getFileLink(photo_file_id);

  return photo_url;
};
