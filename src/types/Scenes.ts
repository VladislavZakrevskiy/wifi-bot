import { Rate } from '@prisma/client';
import { Context as ContextTelegraf, Scenes } from 'telegraf';
import { SceneSessionData } from 'telegraf/typings/scenes';

export interface SessionContext extends ContextTelegraf {
  session: {
    webapp_data: {
      purchase: Rate;
      method: 'stars' | 'tg_native';
    };
  };
}

interface SessionState extends SceneSessionData {}

export type SessionSceneContext = SessionContext & Scenes.SceneContext<SessionState>;
