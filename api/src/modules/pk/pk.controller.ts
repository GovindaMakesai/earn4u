import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PkService } from './pk.service';
import { UserId } from '../../common/decorators/user.decorator';

@ApiTags('PK Battles')
@ApiBearerAuth()
@Controller('pk')
export class PkController {
  constructor(private readonly pkService: PkService) {}

  @Post('invite')
  @ApiOperation({ summary: 'Invite to PK battle' })
  invite(
    @UserId() challengerId: string,
    @Body()
    body: {
      opponentId: string;
      type?: 'solo_1v1' | 'team_2v2';
      durationSeconds?: number;
    },
  ) {
    return this.pkService.invite(
      challengerId,
      body.opponentId,
      body.type,
      body.durationSeconds,
    );
  }

  @Post(':battleId/accept')
  @ApiOperation({ summary: 'Accept PK invitation' })
  accept(@Param('battleId') battleId: string) {
    return this.pkService.accept(battleId);
  }

  @Get(':battleId')
  @ApiOperation({ summary: 'Get battle status' })
  getBattle(@Param('battleId') battleId: string) {
    return this.pkService.addScore(battleId, 'side_a', 0);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'PK leaderboard' })
  leaderboard(@Query('period') period?: string) {
    return this.pkService.getLeaderboard(period);
  }
}
