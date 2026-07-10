import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { GiftsService } from './gifts.service';
import { SendGiftDto } from './dto/gifts.dto';
import { UserId } from '../../common/decorators/user.decorator';
import { GiftContextType } from './entities/gift.entity';

@ApiTags('Gifts')
@ApiBearerAuth()
@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Get()
  @ApiOperation({ summary: 'Get gift catalog' })
  getCatalog(
    @Query('category') category?: string,
    @Query('vipLevel') vipLevel?: number,
  ) {
    return this.giftsService.getCatalog(category, vipLevel);
  }

  @Post('send')
  @ApiOperation({ summary: 'Send a gift' })
  @ApiHeader({ name: 'Idempotency-Key', required: true })
  sendGift(
    @UserId() senderId: string,
    @Body() dto: SendGiftDto,
    @Headers('idempotency-key') idempotencyKey: string,
  ) {
    return this.giftsService.sendGift(senderId, dto, idempotencyKey);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get gift leaderboard for context' })
  getLeaderboard(
    @Query('contextType') contextType: GiftContextType,
    @Query('contextId') contextId: string,
    @Query('limit') limit?: number,
  ) {
    return this.giftsService.getLeaderboard(contextType, contextId, limit);
  }
}
