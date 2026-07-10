import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphoricons_flutter/phosphoricons_flutter.dart';
import '../../../core/theme/app_animations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../shared/widgets/avatar_frame.dart';
import '../../../shared/widgets/glass_surface.dart';
import '../../../shared/widgets/premium_button.dart';
import '../../../shared/widgets/stat_badge.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.richBlack,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: AppColors.richBlack,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(gradient: AppColors.gradientHero),
                child: Stack(
                  alignment: Alignment.bottomCenter,
                  children: [
                    Positioned(
                      bottom: -30,
                      child: AvatarFrame(initials: 'You', size: 88, vipLevel: 12)
                          .animate()
                          .fadeIn(duration: AppAnimations.entrance)
                          .scale(begin: const Offset(0.9, 0.9)),
                    ),
                  ],
                ),
              ),
            ),
            actions: [
              IconButton(icon: Icon(PhosphorIcons.gearBold, color: AppColors.textSecondary), onPressed: () {}),
            ],
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(AppSpacing.lg, 48, AppSpacing.lg, 0),
              child: Column(
                children: [
                  Text('YourName', style: Theme.of(context).textTheme.headlineLarge),
                  const SizedBox(height: AppSpacing.sm),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      VipBadge(level: 12),
                      SizedBox(width: AppSpacing.sm),
                      WealthBadge(level: 8),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.xxl),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _StatColumn(value: '24.5K', label: 'Followers'),
                      _StatColumn(value: '1.2M', label: 'Gifts Received'),
                      _StatColumn(value: '89', label: 'Streams'),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.xxl),
                  Row(
                    children: [
                      Expanded(child: PremiumButton(label: 'Edit Profile', onPressed: () {})),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: PremiumButton(
                          label: 'Wallet',
                          isGold: true,
                          icon: PhosphorIcons.walletBold,
                          onPressed: () => context.push('/wallet'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.md),
                  PremiumButton(
                    label: 'Gift Gallery',
                    icon: PhosphorIcons.giftBold,
                    expanded: true,
                    onPressed: () => context.push('/gifts'),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Text('Achievements', style: Theme.of(context).textTheme.headlineSmall),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.lg, 0, AppSpacing.lg, 120),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                mainAxisSpacing: AppSpacing.md,
                crossAxisSpacing: AppSpacing.md,
                childAspectRatio: 0.85,
              ),
              delegate: SliverChildListDelegate([
                _Achievement(icon: '🏆', title: 'Top Gifter', unlocked: true),
                _Achievement(icon: '🔥', title: '7 Day Streak', unlocked: true),
                _Achievement(icon: '👑', title: 'VIP Elite', unlocked: true),
                _Achievement(icon: '🎤', title: 'Voice Host', unlocked: false),
                _Achievement(icon: '⚔️', title: 'PK Champion', unlocked: false),
                _Achievement(icon: '💎', title: 'Whale', unlocked: false),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatColumn extends StatelessWidget {
  final String value;
  final String label;

  const _StatColumn({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: AppTypography.stat.copyWith(fontSize: 22)),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }
}

class _Achievement extends StatelessWidget {
  final String icon;
  final String title;
  final bool unlocked;

  const _Achievement({required this.icon, required this.title, required this.unlocked});

  @override
  Widget build(BuildContext context) {
    return GlassSurface(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Opacity(
        opacity: unlocked ? 1 : 0.4,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(icon, style: const TextStyle(fontSize: 28)),
            const SizedBox(height: AppSpacing.sm),
            Text(title, style: Theme.of(context).textTheme.labelMedium, textAlign: TextAlign.center, maxLines: 2),
          ],
        ),
      ),
    );
  }
}
