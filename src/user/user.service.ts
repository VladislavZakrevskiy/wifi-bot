import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserCreateDto } from './dto/UserCreateDto';
import { UserFindProps } from './dto/UserFindProps';
import { UserUpdateDto } from './dto/UserUpdateDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByProps({ id, username, tg_id }: UserFindProps) {
    return await this.prisma.user.findUnique({ where: { id, username, tg_id }, include: { rate: true } });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany({ include: { rate: true } });
  }

  async createUser({ password, username, tg_id }: UserCreateDto) {
    const candidate = await this.prisma.user.findUnique({
      where: { username },
    });

    if (candidate) return candidate;
    const user = await this.prisma.user.create({
      data: { password, username, tg_id },
    });

    return user;
  }

  async deleteUser({ id }: { id: string }) {
    return await this.prisma.user.delete({ where: { id } });
  }

  async updateUser({ id, ...updateData }: UserUpdateDto) {
    const user = await this.getUserByProps({ id });
    return await this.prisma.user.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data: {
        ...user,
        ...updateData,
        rate_id: undefined,
        rate: { connect: { id: updateData.rate_id ? updateData.rate_id : user.rate_id } },
      },
    });
  }
}
