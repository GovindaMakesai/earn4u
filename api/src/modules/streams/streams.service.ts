import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface LiveStream {
  id: string;
  hostId: string;
  title: string;
  type: 'video' | 'audio';
  status: 'preparing' | 'live' | 'ended';
  category: string;
  viewerCount: number;
  peakViewers: number;
  webrtcRoomId: string;
  startedAt: Date | null;
  createdAt: Date;
}

@Injectable()
export class StreamsService {
  private streams = new Map<string, LiveStream>();

  start(hostId: string, data: Partial<LiveStream>): LiveStream {
    const stream: LiveStream = {
      id: randomUUID(),
      hostId,
      title: data.title ?? 'Live Stream',
      type: data.type ?? 'video',
      status: 'live',
      category: data.category ?? 'general',
      viewerCount: 0,
      peakViewers: 0,
      webrtcRoomId: `room_${randomUUID().slice(0, 8)}`,
      startedAt: new Date(),
      createdAt: new Date(),
    };
    this.streams.set(stream.id, stream);
    return stream;
  }

  findLive(category?: string): LiveStream[] {
    return Array.from(this.streams.values())
      .filter(
        (s) => s.status === 'live' && (!category || s.category === category),
      )
      .sort((a, b) => b.viewerCount - a.viewerCount);
  }

  findById(id: string): LiveStream | undefined {
    return this.streams.get(id);
  }

  joinViewer(streamId: string): LiveStream | null {
    const stream = this.streams.get(streamId);
    if (!stream || stream.status !== 'live') return null;
    stream.viewerCount++;
    if (stream.viewerCount > stream.peakViewers) {
      stream.peakViewers = stream.viewerCount;
    }
    return stream;
  }

  end(streamId: string, hostId: string): boolean {
    const stream = this.streams.get(streamId);
    if (!stream || stream.hostId !== hostId) return false;
    stream.status = 'ended';
    return true;
  }
}
