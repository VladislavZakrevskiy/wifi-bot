import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRateDto } from './dto/CreateRateDto';
import { UpdateRateDto } from './dto/UpdateRateDto';

@Injectable()
export class RateService {
  constructor(private readonly prisma: PrismaService) {}

  async createRate(data: CreateRateDto) {
    return this.prisma.rate.create({ data });
  }

  async getAllRates({ withUsers }: { withUsers: boolean }) {
    return this.prisma.rate.findMany({ include: { users: withUsers } });
  }

  async getRateById(id: string) {
    const rate = await this.prisma.rate.findUnique({ where: { id } });
    if (!rate) throw new NotFoundException(`Rate with ID ${id} not found`);
    return rate;
  }

  async updateRate(id: string, data: UpdateRateDto) {
    const rate = await this.prisma.rate.update({
      where: { id },
      data,
    });
    if (!rate) throw new NotFoundException(`Rate with ID ${id} not found`);
    return rate;
  }

  async deleteRate(id: string) {
    return await this.prisma.rate.delete({ where: { id } });
  }
}
