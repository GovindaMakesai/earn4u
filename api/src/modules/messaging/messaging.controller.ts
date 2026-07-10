import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagingService } from './messaging.service';
import { UserId } from '../../common/decorators/user.decorator';

@ApiTags('Messaging')
@ApiBearerAuth()
@Controller('conversations')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get()
  @ApiOperation({ summary: 'List conversations' })
  list(@UserId() userId: string) {
    return this.messagingService.getUserConversations(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create conversation' })
  create(
    @UserId() creatorId: string,
    @Body() body: { type?: 'direct' | 'group'; participantIds: string[]; name?: string },
  ) {
    return this.messagingService.createConversation(
      creatorId,
      body.participantIds,
      body.type,
      body.name,
    );
  }

  @Get(':conversationId/messages')
  @ApiOperation({ summary: 'Get messages' })
  getMessages(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: number,
  ) {
    return this.messagingService.getMessages(conversationId, limit);
  }

  @Post(':conversationId/messages')
  @ApiOperation({ summary: 'Send message' })
  sendMessage(
    @Param('conversationId') conversationId: string,
    @UserId() senderId: string,
    @Body() body: { type: 'text' | 'image' | 'video' | 'audio'; content?: string; mediaUrl?: string },
  ) {
    return this.messagingService.sendMessage(
      conversationId,
      senderId,
      body.type,
      body.content,
      body.mediaUrl,
    );
  }
}
