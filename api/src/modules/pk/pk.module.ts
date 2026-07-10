import { Module } from '@nestjs/common';
import { PkController } from './pk.controller';
import { PkService } from './pk.service';

@Module({
  controllers: [PkController],
  providers: [PkService],
  exports: [PkService],
})
export class PkModule {}
