import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';

export type UserUpdateDto = Partial<Omit<User, 'id' | 'tg_id'>> & { id: string } & {
  rate?: Prisma.RateUpdateOneWithoutUsersNestedInput;
};
