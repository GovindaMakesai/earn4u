import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/demo_content.dart';
import '../../../core/theme/app_animations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/live_stream_card.dart';

class DiscoverScreen extends StatelessWidget {
  const DiscoverScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.richBlack,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            title: Text('Discover', style: Theme.of(context).textTheme.headlineLarge),
            backgroundColor: AppColors.richBlack,
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                  border: Border.all(color: AppColors.borderSubtle),
                ),
                child: Row(
                  children: [
                    Icon(Icons.search, color: AppColors.textTertiary, size: 20),
                    const SizedBox(width: AppSpacing.md),
                    Text('Search creators, rooms, tags...', style: Theme.of(context).textTheme.bodyMedium),
                  ],
                ),
              ),
            ).animate().fadeIn(duration: AppAnimations.normal),
          ),
          const SliverToBoxAdapter(child: SectionHeader(title: 'Rising Stars')),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(AppSpacing.lg, 0, AppSpacing.lg, 120),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: AppSpacing.md,
                crossAxisSpacing: AppSpacing.md,
                childAspectRatio: 0.72,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, i) => LiveStreamCard(data: LiveCardData.fromDemo(i + 4), animationIndex: i),
                childCount: 4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
