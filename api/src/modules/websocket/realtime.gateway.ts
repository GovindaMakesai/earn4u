import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private userSockets = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [userId, sockets] of this.userSockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) this.userSockets.delete(userId);
    }
  }

  @SubscribeMessage('auth')
  handleAuth(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    if (!this.userSockets.has(data.userId)) {
      this.userSockets.set(data.userId, new Set());
    }
    this.userSockets.get(data.userId)!.add(client.id);
    client.join(`user:${data.userId}`);
    return { authenticated: true };
  }

  @SubscribeMessage('room:join')
  handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.join(`room:${data.roomId}`);
    this.server.to(`room:${data.roomId}`).emit('room:user-joined', {
      socketId: client.id,
      roomId: data.roomId,
    });
    return { joined: true, roomId: data.roomId };
  }

  @SubscribeMessage('room:reaction')
  handleRoomReaction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; emoji: string; userId: string },
  ) {
    this.server.to(`room:${data.roomId}`).emit('room:reaction', data);
  }

  @SubscribeMessage('stream:comment')
  handleStreamComment(
    @MessageBody() data: { streamId: string; userId: string; text: string },
  ) {
    this.server.to(`stream:${data.streamId}`).emit('stream:comment', data);
  }

  @SubscribeMessage('chat:typing')
  handleTyping(
    @MessageBody() data: { conversationId: string; userId: string },
  ) {
    this.server.to(`chat:${data.conversationId}`).emit('chat:typing', data);
  }

  broadcastGift(contextType: string, contextId: string, giftEvent: unknown) {
    const room = contextType === 'room' ? `room:${contextId}` : `stream:${contextId}`;
    this.server.to(room).emit(`${contextType}:gift`, giftEvent);
  }

  broadcastPkScore(battleId: string, scores: unknown) {
    this.server.to(`pk:${battleId}`).emit('pk:score-update', scores);
  }
}
