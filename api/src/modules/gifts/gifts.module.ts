import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftsController } from './gifts.controller';
import { GiftsService } from './gifts.service';
import { GiftCatalog, GiftEvent } from './entities/gift.entity';
import { Profile } from '../users/entities/profile.entity';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftCatalog, GiftEvent, Profile]),
    WalletModule,
  ],
  controllers: [GiftsController],
  providers: [GiftsService],
  exports: [GiftsService],
})
export class GiftsModule {}
