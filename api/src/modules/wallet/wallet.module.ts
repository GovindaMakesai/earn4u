import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet, Transaction, CoinPackage } from './entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction, CoinPackage])],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService, TypeOrmModule],
})
export class WalletModule {}
