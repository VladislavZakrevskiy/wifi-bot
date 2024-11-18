import { User } from '@prisma/client';

export type UserUpdateDto = Partial<Omit<User, 'id' | 'tg_id'>> & { id: string };
