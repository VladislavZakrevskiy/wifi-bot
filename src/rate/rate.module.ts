import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from 'src/user/jwt.service';
import { RateCronService } from './rate.cron';
import { RouterOSService } from 'src/router/router.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [RateController],
  providers: [RateService, PrismaService, JwtService, RateCronService, RouterOSService, UserService],
})
export class RateModule {}
