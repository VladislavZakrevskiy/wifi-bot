import { Controller, Get, Param } from '@nestjs/common';
import { RateService } from './rate.service';

@Controller('rate')
export class RateController {
  constructor(private rateService: RateService) {}

  @Get()
  async getAllRates() {
    return await this.rateService.getAllRates({ withUsers: true });
  }

  @Get('/:id')
  async getRateById(@Param('id') rate_id: string) {
    const rate = await this.rateService.getRateById(rate_id);
    return rate;
  }
}
