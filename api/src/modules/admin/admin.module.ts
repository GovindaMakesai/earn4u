import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { WithdrawalsModule } from '../withdrawals/withdrawals.module';
import { StreamsModule } from '../streams/streams.module';
import { RoomsModule } from '../rooms/rooms.module';
import { Profile } from '../users/entities/profile.entity';
import { Transaction, Wallet } from '../wallet/entities/wallet.entity';

@Module({
  imports: [
    UsersModule,
    WithdrawalsModule,
    StreamsModule,
    RoomsModule,
    TypeOrmModule.forFeature([Profile, Wallet, Transaction]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
