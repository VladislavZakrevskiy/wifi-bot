import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/core/types/JwtPaylaod';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtService {
  constructor(private prisma: PrismaService) {}

  private readonly accessSecret = process.env.SECRET_ACCESS_JWT;
  private readonly refreshSecret = process.env.SECRET_REFRESH_JWT;
  private readonly expiresAccess = process.env.EXPIRES_IN_ACCESS_JWT;
  private readonly expiresRefresh = process.env.EXPIRES_IN_REFRESH_JWT;

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.expiresAccess,
    });
  }

  async generateRefreshToken(payload: JwtPayload) {
    const refresh_token = jwt.sign(payload, this.refreshSecret, {
      expiresIn: this.expiresRefresh,
    });
    const user = await this.prisma.user.findUnique({ where: { id: payload.user.id }, include: { refresh_token: true } });
    if (user.refresh_token) {
      await this.prisma.refreshToken.delete({ where: { id: user.refresh_token.id } });
    }
    const token = await this.prisma.refreshToken.create({ data: { token: refresh_token, user_id: user.id } });
    await this.prisma.user.update({ where: { id: user.id }, data: { ...user, refresh_token: { connect: { id: token.id } } } });

    return refresh_token;
  }

  decodeAccessToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.accessSecret);
      return decoded as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  decodeRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.refreshSecret);
      return decoded as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  verifyAccessToken(token: string) {
    try {
      console.log(jwt.verify(token, this.accessSecret));
      return jwt.verify(token, this.accessSecret) as JwtPayload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, this.refreshSecret) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
