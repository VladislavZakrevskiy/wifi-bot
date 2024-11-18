import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from 'src/user/jwt.service';

@Module({
  controllers: [RateController],
  providers: [RateService, PrismaService, JwtService],
})
export class RateModule {}
