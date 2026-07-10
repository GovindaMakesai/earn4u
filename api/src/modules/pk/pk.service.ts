import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface PkBattle {
  id: string;
  type: 'solo_1v1' | 'team_2v2';
  status: 'pending' | 'active' | 'completed';
  durationSeconds: number;
  totalScoreA: number;
  totalScoreB: number;
  winnerSide: 'side_a' | 'side_b' | 'draw' | null;
  participants: PkParticipant[];
  startedAt: Date | null;
  createdAt: Date;
}

export interface PkParticipant {
  userId: string;
  side: 'side_a' | 'side_b';
  score: number;
}

@Injectable()
export class PkService {
  private battles = new Map<string, PkBattle>();

  invite(
    challengerId: string,
    opponentId: string,
    type: PkBattle['type'] = 'solo_1v1',
    durationSeconds = 300,
  ): PkBattle {
    const battle: PkBattle = {
      id: randomUUID(),
      type,
      status: 'pending',
      durationSeconds,
      totalScoreA: 0,
      totalScoreB: 0,
      winnerSide: null,
      participants: [
        { userId: challengerId, side: 'side_a', score: 0 },
        { userId: opponentId, side: 'side_b', score: 0 },
      ],
      startedAt: null,
      createdAt: new Date(),
    };
    this.battles.set(battle.id, battle);
    return battle;
  }

  accept(battleId: string): PkBattle | null {
    const battle = this.battles.get(battleId);
    if (!battle || battle.status !== 'pending') return null;
    battle.status = 'active';
    battle.startedAt = new Date();
    return battle;
  }

  addScore(
    battleId: string,
    side: 'side_a' | 'side_b',
    amount: number,
  ): PkBattle | null {
    const battle = this.battles.get(battleId);
    if (!battle || battle.status !== 'active') return null;

    if (side === 'side_a') battle.totalScoreA += amount;
    else battle.totalScoreB += amount;

    return battle;
  }

  end(battleId: string): PkBattle | null {
    const battle = this.battles.get(battleId);
    if (!battle || battle.status !== 'active') return null;

    battle.status = 'completed';
    if (battle.totalScoreA > battle.totalScoreB) battle.winnerSide = 'side_a';
    else if (battle.totalScoreB > battle.totalScoreA)
      battle.winnerSide = 'side_b';
    else battle.winnerSide = 'draw';

    return battle;
  }

  getBattle(battleId: string): PkBattle | null {
    return this.battles.get(battleId) ?? null;
  }

  getLeaderboard(period = 'weekly') {
    void period;
    return Array.from(this.battles.values())
      .filter((b) => b.status === 'completed')
      .slice(0, 50);
  }
}
