import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from './jwt.service';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @Post('/hash')
  async getHash(@Body() { dataCheckString }: { dataCheckString: string }) {
    if (!dataCheckString) throw new NotFoundException('No dataCheckString');
    const data = dataCheckString.split('=');
    const tg_user = JSON.parse(data[data.length - 1]);

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(process.env.TELEGRAM_BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    const user = await this.userService.getUserByProps({ tg_id: String(tg_user.id) });
    const accessToken = this.jwtService.generateAccessToken({
      user,
    });
    const refreshToken = this.jwtService.generateRefreshToken({ user });

    return { hash: calculatedHash, access_token: accessToken, refresh_token: refreshToken };
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    const { refresh_token } = body;
    const decoded = this.jwtService.verifyRefreshToken(refresh_token);

    const newAccessToken = this.jwtService.generateAccessToken({
      user: decoded.user,
    });
    const newRefreshToken = this.jwtService.generateRefreshToken({ user: decoded.user });

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  }
}
