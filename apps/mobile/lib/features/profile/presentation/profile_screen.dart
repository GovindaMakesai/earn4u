import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphoricons_flutter/phosphoricons_flutter.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../core/data/app_repository.dart';
import '../../../core/theme/app_animations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/shell_metrics.dart';
import '../../../shared/widgets/avatar_frame.dart';
import '../../../shared/widgets/premium_button.dart';
import '../../../shared/widgets/stat_badge.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(profileProvider);

    return Scaffold(
      backgroundColor: AppColors.richBlack,
      body: profileAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Failed to load profile: $e')),
        data: (profile) {
          final displayName = profile['displayName'] as String? ?? 'User';
          final username = profile['username'] as String? ?? '';
          final vipLevel = (profile['vipLevel'] as num?)?.toInt() ?? 0;
          final wealthLevel = (profile['wealthLevel'] as num?)?.toInt() ?? 0;
          final followers = (profile['followerCount'] as num?)?.toInt() ?? 0;
          final following = (profile['followingCount'] as num?)?.toInt() ?? 0;

          return CustomScrollView(
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
                          child: AvatarFrame(initials: displayName.substring(0, 1), size: 88, vipLevel: vipLevel)
                              .animate()
                              .fadeIn(duration: AppAnimations.entrance)
                              .scale(begin: const Offset(0.9, 0.9)),
                        ),
                      ],
                    ),
                  ),
                ),
                actions: [
                  IconButton(
                    icon: Icon(PhosphorIcons.signOutBold, color: AppColors.textSecondary),
                    onPressed: () async {
                      await ref.read(authProvider.notifier).logout();
                      if (context.mounted) context.go('/login');
                    },
                  ),
                ],
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(AppSpacing.lg, 48, AppSpacing.lg, 0),
                  child: Column(
                    children: [
                      Text(displayName, style: Theme.of(context).textTheme.headlineLarge),
                      Text('@$username', style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary)),
                      const SizedBox(height: AppSpacing.sm),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          VipBadge(level: vipLevel),
                          const SizedBox(width: AppSpacing.sm),
                          WealthBadge(level: wealthLevel),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xxl),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          StatBadge(icon: Icons.people, label: 'Followers', value: '$followers'),
                          StatBadge(icon: Icons.person_add, label: 'Following', value: '$following'),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xxl),
                      PremiumButton(
                        label: 'Wallet & Store',
                        expanded: true,
                        onPressed: () => context.push('/wallet'),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      PremiumButton(
                        label: 'Gift Showcase',
                        expanded: true,
                        onPressed: () => context.push('/gifts'),
                      ),
                      SizedBox(height: ShellMetrics.scrollBottomPadding(context)),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
