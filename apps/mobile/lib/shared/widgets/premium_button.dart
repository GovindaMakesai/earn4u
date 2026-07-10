import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_shadows.dart';

class PremiumButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool isGold;
  final bool isLoading;
  final bool expanded;

  const PremiumButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
    this.isGold = false,
    this.isLoading = false,
    this.expanded = false,
  });

  @override
  Widget build(BuildContext context) {
    final gradient = isGold ? AppColors.gradientGold : AppColors.gradientPrimary;
    final shadow = isGold ? AppShadows.glowGold : AppShadows.glowBlue;

    return SizedBox(
      width: expanded ? double.infinity : null,
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
          boxShadow: onPressed != null ? shadow : null,
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isLoading ? null : onPressed,
            borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xxl, vertical: AppSpacing.md),
              child: Row(
                mainAxisSize: expanded ? MainAxisSize.max : MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (isLoading)
                    const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  else ...[
                    if (icon != null) ...[
                      Icon(icon, color: isGold ? AppColors.richBlack : Colors.white, size: 18),
                      const SizedBox(width: AppSpacing.sm),
                    ],
                    Text(
                      label,
                      style: TextStyle(
                        color: isGold ? AppColors.richBlack : Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                        letterSpacing: 0.2,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
