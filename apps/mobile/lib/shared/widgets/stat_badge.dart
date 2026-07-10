import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

class StatBadge extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color accent;

  const StatBadge({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
    this.accent = AppColors.electricBlue,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
      decoration: BoxDecoration(
        color: accent.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
        border: Border.all(color: accent.withValues(alpha: 0.25)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: accent),
          const SizedBox(width: 6),
          Text(value, style: TextStyle(color: accent, fontSize: 12, fontWeight: FontWeight.w700)),
          const SizedBox(width: 4),
          Text(label, style: Theme.of(context).textTheme.labelSmall),
        ],
      ),
    );
  }
}

class VipBadge extends StatelessWidget {
  final int level;

  const VipBadge({super.key, required this.level});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        gradient: level >= 10 ? AppColors.gradientVip : AppColors.gradientGold,
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Text(
        'VIP $level',
        style: const TextStyle(
          color: AppColors.richBlack,
          fontSize: 11,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}

class WealthBadge extends StatelessWidget {
  final int level;

  const WealthBadge({super.key, required this.level});

  @override
  Widget build(BuildContext context) {
    return StatBadge(
      label: 'Wealth',
      value: 'Lv.$level',
      icon: Icons.diamond_outlined,
      accent: AppColors.gold,
    );
  }
}
