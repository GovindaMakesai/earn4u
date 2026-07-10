import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphoricons_flutter/phosphoricons_flutter.dart';
import '../../core/constants/demo_content.dart';
import '../../core/theme/app_animations.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_shadows.dart';
import 'avatar_frame.dart';
import 'live_badge.dart';

class LiveStreamCard extends StatelessWidget {
  final LiveCardData data;
  final int animationIndex;

  const LiveStreamCard({super.key, required this.data, this.animationIndex = 0});

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.cardGradient(data.gradientIndex);

    return GestureDetector(
      onTap: () => context.push('/live/${data.name}'),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
          boxShadow: AppShadows.card,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: colors,
                        ),
                      ),
                    ),
                    // Subtle mesh overlay
                    DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: RadialGradient(
                          center: Alignment.topRight,
                          radius: 1.2,
                          colors: [
                            AppColors.premiumPurple.withValues(alpha: 0.15),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                    if (data.isLive)
                      const Positioned(top: AppSpacing.sm, left: AppSpacing.sm, child: LiveBadge(compact: true)),
                    Positioned(
                      top: AppSpacing.sm,
                      right: AppSpacing.sm,
                      child: data.type == ContentType.pk
                          ? _PkTag()
                          : data.type == ContentType.voice
                              ? _VoiceTag()
                              : const SizedBox.shrink(),
                    ),
                    Positioned(
                      bottom: AppSpacing.sm,
                      right: AppSpacing.sm,
                      child: ViewerCount(count: data.viewers),
                    ),
                    Positioned(
                      left: AppSpacing.sm,
                      bottom: AppSpacing.sm,
                      child: AvatarFrame(
                        initials: data.name,
                        size: 32,
                        vipLevel: data.vipLevel,
                        gradientColors: colors.reversed.toList(),
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                color: AppColors.elevated,
                padding: const EdgeInsets.fromLTRB(AppSpacing.md, AppSpacing.md, AppSpacing.md, AppSpacing.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data.name,
                      style: Theme.of(context).textTheme.titleMedium,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${data.category}${data.type == ContentType.pk ? ' • PK Live' : ''}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    )
        .animate(delay: AppAnimations.stagger(animationIndex))
        .fadeIn(duration: AppAnimations.entrance, curve: AppAnimations.standard)
        .slideY(begin: 0.06, end: 0, duration: AppAnimations.entrance, curve: AppAnimations.standard);
  }
}

class _PkTag extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        gradient: AppColors.gradientPrimary,
        borderRadius: BorderRadius.circular(6),
      ),
      child: const Text('PK', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800)),
    );
  }
}

class _VoiceTag extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.premiumPurple.withValues(alpha: 0.85),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(PhosphorIcons.microphoneBold, color: Colors.white, size: 10),
          const SizedBox(width: 3),
          const Text('VOICE', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}

class FeaturedLiveCard extends StatelessWidget {
  final LiveCardData data;

  const FeaturedLiveCard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.cardGradient(data.gradientIndex);

    return GestureDetector(
      onTap: () => context.push('/live/${data.name}'),
      child: Container(
        height: 200,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          boxShadow: AppShadows.elevated,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          child: Stack(
            fit: StackFit.expand,
            children: [
              DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: colors,
                  ),
                ),
              ),
              DecoratedBox(decoration: const BoxDecoration(gradient: AppColors.gradientLive)),
              Positioned(
                top: AppSpacing.lg,
                left: AppSpacing.lg,
                child: const LiveBadge(),
              ),
              Positioned(
                bottom: AppSpacing.lg,
                left: AppSpacing.lg,
                right: AppSpacing.lg,
                child: Row(
                  children: [
                    AvatarFrame(initials: data.name, size: 44, vipLevel: data.vipLevel),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(data.name, style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: Colors.white)),
                          Text('${data.category} • Featured', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                    ViewerCount(count: data.viewers),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ).animate().fadeIn(duration: 400.ms).scale(begin: const Offset(0.97, 0.97), curve: AppAnimations.standard);
  }
}

class VoiceRoomCard extends StatelessWidget {
  final String title;
  final int listeners;
  final int seats;
  final int index;

  const VoiceRoomCard({
    super.key,
    required this.title,
    required this.listeners,
    required this.seats,
    this.index = 0,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/voice/$title'),
      child: Container(
        width: 160,
        margin: EdgeInsets.only(right: AppSpacing.md, left: index == 0 ? AppSpacing.lg : 0),
        padding: const EdgeInsets.all(AppSpacing.lg),
        decoration: BoxDecoration(
          gradient: AppColors.gradientCard,
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
          border: Border.all(color: AppColors.glassBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(PhosphorIcons.waveformBold, color: AppColors.premiumPurpleLight, size: 18),
                const Spacer(),
                Text('$listeners', style: Theme.of(context).textTheme.labelSmall),
              ],
            ),
            const Spacer(),
            Text(title, style: Theme.of(context).textTheme.titleMedium, maxLines: 2, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 4),
            Text('$seats seats', style: Theme.of(context).textTheme.bodySmall),
          ],
        ),
      ),
    )
        .animate()
        .fadeIn(delay: AppAnimations.stagger(index))
        .slideX(begin: 0.08, end: 0, duration: AppAnimations.normal, curve: AppAnimations.standard);
  }
}

class SectionHeader extends StatelessWidget {
  final String title;
  final String? action;
  final VoidCallback? onAction;

  const SectionHeader({super.key, required this.title, this.action, this.onAction});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.xxl, AppSpacing.lg, AppSpacing.md),
      child: Row(
        children: [
          Text(title, style: Theme.of(context).textTheme.headlineSmall),
          const Spacer(),
          if (action != null)
            GestureDetector(
              onTap: onAction,
              child: Text(action!, style: Theme.of(context).textTheme.labelLarge?.copyWith(color: AppColors.electricBlue)),
            ),
        ],
      ),
    );
  }
}
