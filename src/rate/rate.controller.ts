import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RateService } from './rate.service';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth.decorator';

@Controller('rate')
export class RateController {
  constructor(private rateService: RateService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllRates() {
    return await this.rateService.getAllRates({ withUsers: true });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getRateById(@Param('id') rate_id: string) {
    const rate = await this.rateService.getRateById(rate_id);
    return rate;
  }
}
