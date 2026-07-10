import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { UserId } from '../../common/decorators/user.decorator';

@ApiTags('Voice Rooms')
@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a voice room' })
  create(@UserId() hostId: string, @Body() body: Record<string, unknown>) {
    return this.roomsService.create(hostId, body);
  }

  @Get()
  @ApiOperation({ summary: 'Discover active rooms' })
  findAll(@Query('category') category?: string) {
    return this.roomsService.findActive(category);
  }

  @Get(':roomId')
  @ApiOperation({ summary: 'Get room details' })
  findOne(@Param('roomId') roomId: string) {
    return this.roomsService.findById(roomId);
  }

  @Post(':roomId/join')
  @ApiOperation({ summary: 'Join a voice room' })
  join(@Param('roomId') roomId: string, @UserId() userId: string) {
    return this.roomsService.join(roomId, userId);
  }

  @Post(':roomId/leave')
  @ApiOperation({ summary: 'Leave a voice room' })
  leave(@Param('roomId') roomId: string) {
    this.roomsService.leave(roomId);
    return { left: true };
  }

  @Delete(':roomId')
  @ApiOperation({ summary: 'Close a voice room' })
  close(@Param('roomId') roomId: string, @UserId() hostId: string) {
    return { closed: this.roomsService.close(roomId, hostId) };
  }
}
