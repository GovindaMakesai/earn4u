import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amountDiamonds: number;
  amountFiat: number;
  currency: string;
  method: 'bank_transfer' | 'upi' | 'paypal';
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed';
  riskScore: number;
  createdAt: Date;
}

const DIAMOND_TO_USD = 0.006;
const WITHDRAWAL_FEES: Record<string, number> = {
  bank_transfer: 0.05,
  upi: 0.03,
  paypal: 0.07,
};

@Injectable()
export class WithdrawalsService {
  private requests: WithdrawalRequest[] = [];

  create(
    userId: string,
    amountDiamonds: number,
    method: WithdrawalRequest['method'],
  ): WithdrawalRequest {
    const grossFiat = amountDiamonds * DIAMOND_TO_USD;
    const fee = WITHDRAWAL_FEES[method] ?? 0.05;
    const amountFiat = grossFiat * (1 - fee);

    const request: WithdrawalRequest = {
      id: randomUUID(),
      userId,
      amountDiamonds,
      amountFiat: Math.round(amountFiat * 100) / 100,
      currency: 'USD',
      method,
      status: 'pending',
      riskScore: this.calculateRiskScore(userId, amountDiamonds),
      createdAt: new Date(),
    };

    if (request.riskScore > 70) request.status = 'under_review';

    this.requests.push(request);
    return request;
  }

  getUserWithdrawals(userId: string): WithdrawalRequest[] {
    return this.requests.filter((r) => r.userId === userId);
  }

  getPending(): WithdrawalRequest[] {
    return this.requests.filter((r) =>
      ['pending', 'under_review'].includes(r.status),
    );
  }

  approve(id: string): WithdrawalRequest | null {
    const request = this.requests.find((r) => r.id === id);
    if (!request) return null;
    request.status = 'approved';
    return request;
  }

  reject(id: string): WithdrawalRequest | null {
    const request = this.requests.find((r) => r.id === id);
    if (!request) return null;
    request.status = 'rejected';
    return request;
  }

  private calculateRiskScore(userId: string, amount: number): number {
    let score = 0;
    if (amount > 100000) score += 30;
    if (userId.startsWith('guest_')) score += 50;
    return Math.min(score, 100);
  }
}
