import { Injectable } from '@nestjs/common';

export interface VipTier {
  level: number;
  name: string;
  priceMonthly: number;
  benefits: string[];
}

const VIP_TIERS: VipTier[] = Array.from({ length: 20 }, (_, i) => {
  const level = i + 1;
  return {
    level,
    name:
      level <= 5
        ? 'Bronze'
        : level <= 10
          ? 'Silver'
          : level <= 15
            ? 'Gold'
            : 'Platinum',
    priceMonthly:
      level <= 5 ? 4.99 : level <= 10 ? 9.99 : level <= 15 ? 19.99 : 49.99,
    benefits: [
      'Exclusive avatar frame',
      ...(level >= 3 ? ['Entry effect'] : []),
      ...(level >= 5 ? ['Custom chat bubble'] : []),
      ...(level >= 10 ? ['Exclusive gifts'] : []),
      ...(level >= 15 ? ['Enhanced visibility'] : []),
      ...(level >= 18 ? ['Exclusive room access'] : []),
    ],
  };
});

@Injectable()
export class VipService {
  getTiers(): VipTier[] {
    return VIP_TIERS;
  }

  getTier(level: number): VipTier | undefined {
    return VIP_TIERS.find((t) => t.level === level);
  }
}
