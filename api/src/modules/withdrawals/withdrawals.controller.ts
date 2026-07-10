import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WithdrawalsService } from './withdrawals.service';
import { UserId } from '../../common/decorators/user.decorator';

@ApiTags('Withdrawals')
@ApiBearerAuth()
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Post()
  @ApiOperation({ summary: 'Request withdrawal' })
  create(
    @UserId() userId: string,
    @Body()
    body: {
      amountDiamonds: number;
      method: 'bank_transfer' | 'upi' | 'paypal';
    },
  ) {
    return this.withdrawalsService.create(
      userId,
      body.amountDiamonds,
      body.method,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Withdrawal history' })
  history(@UserId() userId: string) {
    return this.withdrawalsService.getUserWithdrawals(userId);
  }
}
