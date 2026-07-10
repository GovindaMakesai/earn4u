import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  memberIds: string[];
  lastMessageAt: Date | null;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'sticker';
  content: string | null;
  mediaUrl: string | null;
  createdAt: Date;
}

@Injectable()
export class MessagingService {
  private conversations = new Map<string, Conversation>();
  private messages = new Map<string, Message[]>();

  createConversation(
    creatorId: string,
    participantIds: string[],
    type: 'direct' | 'group' = 'direct',
    name?: string,
  ): Conversation {
    const allMembers = [...new Set([creatorId, ...participantIds])];
    const conversation: Conversation = {
      id: randomUUID(),
      type,
      name: name ?? null,
      memberIds: allMembers,
      lastMessageAt: null,
      createdAt: new Date(),
    };
    this.conversations.set(conversation.id, conversation);
    this.messages.set(conversation.id, []);
    return conversation;
  }

  getUserConversations(userId: string): Conversation[] {
    return Array.from(this.conversations.values())
      .filter((c) => c.memberIds.includes(userId))
      .sort((a, b) => (b.lastMessageAt?.getTime() ?? 0) - (a.lastMessageAt?.getTime() ?? 0));
  }

  sendMessage(
    conversationId: string,
    senderId: string,
    type: Message['type'],
    content?: string,
    mediaUrl?: string,
  ): Message | null {
    const conversation = this.conversations.get(conversationId);
    if (!conversation || !conversation.memberIds.includes(senderId)) return null;

    const message: Message = {
      id: randomUUID(),
      conversationId,
      senderId,
      type,
      content: content ?? null,
      mediaUrl: mediaUrl ?? null,
      createdAt: new Date(),
    };

    const msgs = this.messages.get(conversationId) ?? [];
    msgs.push(message);
    this.messages.set(conversationId, msgs);
    conversation.lastMessageAt = message.createdAt;

    return message;
  }

  getMessages(conversationId: string, limit = 50): Message[] {
    const msgs = this.messages.get(conversationId) ?? [];
    return msgs.slice(-limit);
  }
}
