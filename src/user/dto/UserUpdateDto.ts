import { User } from '@prisma/client';

export type UserUpdateDto = Partial<Omit<User, 'id'>> & { id: string };
