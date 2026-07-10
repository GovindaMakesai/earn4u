import { IsUUID, IsInt, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GiftContextType } from '../entities/gift.entity';

export class SendGiftDto {
  @ApiProperty()
  @IsUUID()
  giftId: string;

  @ApiProperty()
  @IsUUID()
  receiverId: string;

  @ApiProperty({ enum: GiftContextType })
  @IsEnum(GiftContextType)
  contextType: GiftContextType;

  @ApiProperty()
  @IsUUID()
  contextId: string;

  @ApiProperty({ default: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
