import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StreamsService } from './streams.service';
import { UserId } from '../../common/decorators/user.decorator';

@ApiTags('Live Streams')
@ApiBearerAuth()
@Controller('streams')
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Post()
  @ApiOperation({ summary: 'Start a livestream' })
  start(@UserId() hostId: string, @Body() body: Record<string, unknown>) {
    const stream = this.streamsService.start(hostId, body as Parameters<StreamsService['start']>[1]);
    return { stream, webrtcToken: `token_${stream.webrtcRoomId}` };
  }

  @Get()
  @ApiOperation({ summary: 'Discover live streams' })
  findLive(@Query('category') category?: string) {
    return this.streamsService.findLive(category);
  }

  @Get(':streamId')
  @ApiOperation({ summary: 'Get stream details' })
  findOne(@Param('streamId') streamId: string) {
    return this.streamsService.findById(streamId);
  }

  @Post(':streamId/join')
  @ApiOperation({ summary: 'Join stream as viewer' })
  join(@Param('streamId') streamId: string) {
    const stream = this.streamsService.joinViewer(streamId);
    return { stream, webrtcToken: stream ? `token_${stream.webrtcRoomId}` : null };
  }

  @Post(':streamId/end')
  @ApiOperation({ summary: 'End stream' })
  end(@Param('streamId') streamId: string, @UserId() hostId: string) {
    return { ended: this.streamsService.end(streamId, hostId) };
  }
}
