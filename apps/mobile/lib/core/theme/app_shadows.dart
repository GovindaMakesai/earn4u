import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppShadows {
  AppShadows._();

  static List<BoxShadow> get card => [
        BoxShadow(color: Colors.black.withValues(alpha: 0.35), blurRadius: 16, offset: const Offset(0, 4)),
      ];

  static List<BoxShadow> get elevated => [
        BoxShadow(color: Colors.black.withValues(alpha: 0.45), blurRadius: 24, offset: const Offset(0, 8)),
      ];

  static List<BoxShadow> get glowBlue => [
        BoxShadow(color: AppColors.electricBlue.withValues(alpha: 0.35), blurRadius: 20, spreadRadius: 0),
      ];

  static List<BoxShadow> get glowPurple => [
        BoxShadow(color: AppColors.premiumPurple.withValues(alpha: 0.4), blurRadius: 24, spreadRadius: -2),
      ];

  static List<BoxShadow> get glowGold => [
        BoxShadow(color: AppColors.gold.withValues(alpha: 0.3), blurRadius: 16, spreadRadius: 0),
      ];

  static List<BoxShadow> get glowLive => [
        BoxShadow(color: AppColors.liveGlow, blurRadius: 12, spreadRadius: 0),
      ];
}
