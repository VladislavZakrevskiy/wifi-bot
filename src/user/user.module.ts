import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from './jwt.service';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth.decorator';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService, JwtAuthGuard],
})
export class UserModule {}
