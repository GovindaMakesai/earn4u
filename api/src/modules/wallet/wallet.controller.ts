import { Controller, Get, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { UserId } from '../../common/decorators/user.decorator';
import { Currency, TransactionCategory } from './entities/wallet.entity';

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: 'Get wallet balances' })
  getWallet(@UserId() userId: string) {
    return this.walletService.getWallet(userId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  getTransactions(
    @UserId() userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('currency') currency?: Currency,
    @Query('category') category?: TransactionCategory,
  ) {
    return this.walletService.getTransactions(userId, page, limit, currency, category);
  }

  @Get('coin-packages')
  @ApiOperation({ summary: 'Get available coin packages' })
  getCoinPackages(@Query('platform') platform?: string) {
    return this.walletService.getCoinPackages(platform);
  }
}
