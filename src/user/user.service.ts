import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserCreateDto } from './dto/UserCreateDto';
import { UserFindProps } from './dto/UserFindProps';
import { UserUpdateDto } from './dto/UserUpdateDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByProps({ id, username }: UserFindProps) {
    return await this.prisma.user.findUnique({ where: { id, username } });
  }

  async createUser({ password, username }: UserCreateDto) {
    const candidate = await this.prisma.user.findUnique({
      where: { username },
    });

    if (candidate) return candidate;
    const user = await this.prisma.user.create({
      data: { password, username },
    });

    // TODO Добавить сохранение с роутером

    return user;
  }

  async deleteUser({ id }: { id: string }) {
    return await this.prisma.user.delete({ where: { id } });
  }

  async updateUser({ id, ...updateData }: UserUpdateDto) {
    const user = await this.getUserByProps({ id });
    return await this.prisma.user.update({
      where: { id },
      data: { ...user, ...updateData },
    });
  }
}
