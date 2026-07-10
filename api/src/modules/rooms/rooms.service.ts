import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface VoiceRoom {
  id: string;
  hostId: string;
  title: string;
  type: 'public' | 'private' | 'password';
  maxSeats: number;
  status: 'active' | 'closed';
  listenerCount: number;
  category: string;
  seats: RoomSeat[];
  createdAt: Date;
}

export interface RoomSeat {
  seatNumber: number;
  userId: string | null;
  role: 'host' | 'co_host' | 'speaker' | 'audience';
  isMuted: boolean;
}

@Injectable()
export class RoomsService {
  private rooms = new Map<string, VoiceRoom>();

  create(hostId: string, data: Partial<VoiceRoom>): VoiceRoom {
    const room: VoiceRoom = {
      id: randomUUID(),
      hostId,
      title: data.title ?? 'Untitled Room',
      type: data.type ?? 'public',
      maxSeats: data.maxSeats ?? 8,
      status: 'active',
      listenerCount: 0,
      category: data.category ?? 'general',
      seats: Array.from({ length: data.maxSeats ?? 8 }, (_, i) => ({
        seatNumber: i,
        userId: i === 0 ? hostId : null,
        role: i === 0 ? 'host' : 'audience',
        isMuted: false,
      })),
      createdAt: new Date(),
    };
    this.rooms.set(room.id, room);
    return room;
  }

  findActive(category?: string): VoiceRoom[] {
    return Array.from(this.rooms.values())
      .filter(
        (r) => r.status === 'active' && (!category || r.category === category),
      )
      .sort((a, b) => b.listenerCount - a.listenerCount);
  }

  findById(id: string): VoiceRoom | undefined {
    return this.rooms.get(id);
  }

  join(roomId: string, userId: string): VoiceRoom | null {
    void userId;
    const room = this.rooms.get(roomId);
    if (!room || room.status !== 'active') return null;
    room.listenerCount++;
    return room;
  }

  leave(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (room && room.listenerCount > 0) room.listenerCount--;
  }

  close(roomId: string, hostId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room || room.hostId !== hostId) return false;
    room.status = 'closed';
    return true;
  }
}
