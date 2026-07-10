import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

class AvatarFrame extends StatelessWidget {
  final String initials;
  final double size;
  final int vipLevel;
  final bool showOnline;
  final List<Color>? gradientColors;

  const AvatarFrame({
    super.key,
    required this.initials,
    this.size = 48,
    this.vipLevel = 0,
    this.showOnline = false,
    this.gradientColors,
  });

  @override
  Widget build(BuildContext context) {
    final frameGradient = vipLevel >= 10
        ? AppColors.gradientVip
        : vipLevel >= 5
            ? AppColors.gradientGold
            : null;

    return SizedBox(
      width: size + (frameGradient != null ? 6 : 0),
      height: size + (frameGradient != null ? 6 : 0),
      child: Stack(
        children: [
          if (frameGradient != null)
            Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: frameGradient,
              ),
            ),
          Center(
            child: Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: gradientColors ?? AppColors.cardGradient(initials.hashCode),
                ),
                border: Border.all(
                  color: frameGradient != null ? AppColors.richBlack : AppColors.borderSubtle,
                  width: 2,
                ),
              ),
              alignment: Alignment.center,
              child: Text(
                initials.length >= 2 ? initials.substring(0, 2).toUpperCase() : initials,
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: size * 0.32,
                ),
              ),
            ),
          ),
          if (showOnline)
            Positioned(
              right: frameGradient != null ? 2 : 0,
              bottom: frameGradient != null ? 2 : 0,
              child: Container(
                width: size * 0.28,
                height: size * 0.28,
                decoration: BoxDecoration(
                  color: AppColors.online,
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.richBlack, width: 2),
                ),
              ),
            ),
          if (vipLevel > 0)
            Positioned(
              right: 0,
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                decoration: BoxDecoration(
                  gradient: AppColors.gradientGold,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  'V$vipLevel',
                  style: const TextStyle(
                    color: AppColors.richBlack,
                    fontSize: 8,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
