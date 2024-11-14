import { Body, Controller, Post } from '@nestjs/common';
import * as crypto from 'crypto';

@Controller('auth')
export class UserController {
  @Post('/hash')
  getHash(@Body() { dataCheckString }: { dataCheckString: string }) {
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(process.env.TELEGRAM_BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return { hash: calculatedHash };
  }
}
