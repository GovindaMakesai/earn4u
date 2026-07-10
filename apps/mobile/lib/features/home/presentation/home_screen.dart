import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:phosphoricons_flutter/phosphoricons_flutter.dart';
import '../../../core/constants/demo_content.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/category_chip.dart';
import '../../../shared/widgets/live_stream_card.dart';
import '../../shell/main_shell.dart';

final homeCategoryProvider = StateProvider<int>((ref) => 0);

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedCategory = ref.watch(homeCategoryProvider);

    return Scaffold(
      backgroundColor: AppColors.richBlack,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
        slivers: [
          SliverAppBar(
            floating: true,
            snap: true,
            backgroundColor: AppColors.richBlack,
            title: const Earn4UBrand(),
            actions: [
              IconButton(
                icon: Icon(PhosphorIcons.magnifyingGlassBold, color: AppColors.textSecondary, size: 22),
                onPressed: () {},
              ),
              IconButton(
                icon: Stack(
                  children: [
                    Icon(PhosphorIcons.bellBold, color: AppColors.textSecondary, size: 22),
                    Positioned(
                      right: 0,
                      top: 0,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(color: AppColors.live, shape: BoxShape.circle),
                      ),
                    ),
                  ],
                ),
                onPressed: () {},
              ),
              const SizedBox(width: AppSpacing.sm),
            ],
          ),

          // Featured hero
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.sm, AppSpacing.lg, 0),
              child: FeaturedLiveCard(data: LiveCardData.fromDemo(1)),
            ),
          ),

          // Category chips
          SliverToBoxAdapter(
            child: SizedBox(
              height: 44,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.xs),
                itemCount: DemoContent.trendingTags.length,
                itemBuilder: (context, i) => CategoryChip(
                  label: DemoContent.trendingTags[i],
                  isSelected: selectedCategory == i,
                  onTap: () => ref.read(homeCategoryProvider.notifier).state = i,
                ),
              ),
            ),
          ),

          // Voice rooms horizontal
          const SliverToBoxAdapter(child: SectionHeader(title: 'Voice Rooms', action: 'See all')),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 120,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: DemoContent.voiceRooms.length,
                itemBuilder: (context, i) {
                  final room = DemoContent.voiceRooms[i];
                  return VoiceRoomCard(
                    title: room.$1,
                    listeners: room.$2,
                    seats: room.$3,
                    index: i,
                  );
                },
              ),
            ),
          ),

          // Trending live grid
          const SliverToBoxAdapter(child: SectionHeader(title: 'Trending Now')),
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
                (context, index) => LiveStreamCard(
                  data: LiveCardData.fromDemo(index + 2),
                  animationIndex: index,
                ),
                childCount: 6,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
