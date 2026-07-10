import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { WithdrawalsModule } from '../withdrawals/withdrawals.module';

@Module({
  imports: [UsersModule, WithdrawalsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
