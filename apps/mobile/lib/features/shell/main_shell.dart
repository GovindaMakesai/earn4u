import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphoricons_flutter/phosphoricons_flutter.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_shadows.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/shell_metrics.dart';

class MainShell extends ConsumerWidget {
  final Widget child;

  const MainShell({super.key, required this.child});

  int _index(String path) {
    if (path.startsWith('/discover')) return 1;
    if (path.startsWith('/live-hub')) return 2;
    if (path.startsWith('/messages')) return 3;
    if (path.startsWith('/profile')) return 4;
    return 0;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final path = GoRouterState.of(context).uri.path;
    final selected = _index(path);
    final bottomMargin = ShellMetrics.navBarBottomMargin(context);

    return Scaffold(
      backgroundColor: AppColors.richBlack,
      body: child,
      extendBody: true,
      bottomNavigationBar: Padding(
        padding: EdgeInsets.fromLTRB(AppSpacing.lg, 0, AppSpacing.lg, bottomMargin),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
          child: Container(
            height: AppSpacing.navHeight,
            decoration: BoxDecoration(
              color: AppColors.elevated.withValues(alpha: 0.95),
              border: Border.all(color: AppColors.glassBorder),
              boxShadow: AppShadows.elevated,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _NavItem(
                  icon: PhosphorIcons.houseBold,
                  label: 'Home',
                  isSelected: selected == 0,
                  onTap: () => context.go('/'),
                ),
                _NavItem(
                  icon: PhosphorIcons.compassBold,
                  label: 'Discover',
                  isSelected: selected == 1,
                  onTap: () => context.go('/discover'),
                ),
                _GoLiveButton(onTap: () => context.push('/live-hub')),
                _NavItem(
                  icon: PhosphorIcons.chatCircleBold,
                  label: 'Messages',
                  isSelected: selected == 3,
                  onTap: () => context.go('/messages'),
                ),
                _NavItem(
                  icon: PhosphorIcons.userBold,
                  label: 'Profile',
                  isSelected: selected == 4,
                  onTap: () => context.go('/profile'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: SizedBox(
        width: 56,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.electricBlue.withValues(alpha: 0.15) : Colors.transparent,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: isSelected ? AppColors.electricBlueLight : AppColors.textTertiary,
                size: 22,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                color: isSelected ? AppColors.electricBlueLight : AppColors.textTertiary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GoLiveButton extends StatelessWidget {
  final VoidCallback onTap;

  const _GoLiveButton({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: AppSpacing.goLiveSize,
        height: AppSpacing.goLiveSize,
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          gradient: AppColors.gradientPrimary,
          shape: BoxShape.circle,
          boxShadow: AppShadows.glowPurple,
        ),
        child: const Icon(PhosphorIcons.broadcastBold, color: Colors.white, size: 26),
      ),
    );
  }
}

class Earn4UBrand extends StatelessWidget {
  const Earn4UBrand({super.key});

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      shaderCallback: (bounds) => AppColors.gradientPrimary.createShader(bounds),
      child: Text('Earn4U', style: AppTypography.brand.copyWith(color: Colors.white)),
    );
  }
}
