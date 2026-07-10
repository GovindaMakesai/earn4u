import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VipService } from './vip.service';
import { Public } from '../../common/decorators/auth.decorators';

@ApiTags('VIP')
@Controller('vip')
export class VipController {
  constructor(private readonly vipService: VipService) {}

  @Public()
  @Get('tiers')
  @ApiOperation({ summary: 'Get VIP tier definitions' })
  getTiers() {
    return this.vipService.getTiers();
  }
}
