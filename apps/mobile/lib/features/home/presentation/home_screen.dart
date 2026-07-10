import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphoricons_flutter/phosphoricons_flutter.dart';
import '../../../core/constants/demo_content.dart';
import '../../../core/data/app_repository.dart';
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
    final streamsAsync = ref.watch(streamsProvider);
    final roomsAsync = ref.watch(roomsProvider);

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
                onPressed: () => context.go('/discover'),
              ),
              const SizedBox(width: AppSpacing.sm),
            ],
          ),
          streamsAsync.when(
            loading: () => const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.all(AppSpacing.xxl),
                child: Center(child: CircularProgressIndicator()),
              ),
            ),
            error: (e, _) => SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Text('Failed to load streams: $e', style: const TextStyle(color: AppColors.live)),
              ),
            ),
            data: (streams) {
              if (streams.isEmpty) {
                return const SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.all(AppSpacing.lg),
                    child: Text('No live streams yet', style: TextStyle(color: AppColors.textSecondary)),
                  ),
                );
              }
              final featured = streams.first;
              return SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.sm, AppSpacing.lg, 0),
                  child: GestureDetector(
                    onTap: () => context.go('/live/${featured['id']}'),
                    child: LiveStreamCard(
                      data: LiveCardData(
                        name: featured['title'] as String? ?? 'Live',
                        viewers: (featured['viewerCount'] as num?)?.toInt() ?? 0,
                        category: featured['category'] as String? ?? 'general',
                        isLive: featured['status'] == 'live',
                        vipLevel: 0,
                        type: ContentType.live,
                        gradientIndex: 0,
                      ),
                      animationIndex: 0,
                    ),
                  ),
                ),
              );
            },
          ),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 44,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.xs),
                itemCount: 4,
                itemBuilder: (context, i) {
                  const tags = ['All', 'Music', 'Gaming', 'Talk'];
                  return CategoryChip(
                    label: tags[i],
                    isSelected: selectedCategory == i,
                    onTap: () => ref.read(homeCategoryProvider.notifier).state = i,
                  );
                },
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SectionHeader(title: 'Voice Rooms', action: 'See all')),
          roomsAsync.when(
            loading: () => const SliverToBoxAdapter(child: Center(child: CircularProgressIndicator())),
            error: (e, _) => SliverToBoxAdapter(child: Text('Rooms error: $e')),
            data: (rooms) => SliverToBoxAdapter(
              child: SizedBox(
                height: 120,
                child: rooms.isEmpty
                    ? const Center(child: Text('No voice rooms', style: TextStyle(color: AppColors.textSecondary)))
                    : ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: rooms.length,
                        itemBuilder: (context, i) {
                          final room = rooms[i];
                          return GestureDetector(
                            onTap: () => context.go('/voice/${room['id']}'),
                            child: VoiceRoomCard(
                              title: room['title'] as String? ?? 'Room',
                              listeners: (room['listenerCount'] as num?)?.toInt() ?? 0,
                              seats: (room['maxSeats'] as num?)?.toInt() ?? 8,
                              index: i,
                            ),
                          );
                        },
                      ),
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SectionHeader(title: 'Trending Now')),
          streamsAsync.when(
            loading: () => const SliverToBoxAdapter(child: SizedBox.shrink()),
            error: (_, __) => const SliverToBoxAdapter(child: SizedBox.shrink()),
            data: (streams) => SliverPadding(
              padding: const EdgeInsets.fromLTRB(AppSpacing.lg, 0, AppSpacing.lg, 120),
              sliver: streams.isEmpty
                  ? const SliverToBoxAdapter(child: SizedBox.shrink())
                  : SliverGrid(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        mainAxisSpacing: AppSpacing.md,
                        crossAxisSpacing: AppSpacing.md,
                        childAspectRatio: 0.72,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final stream = streams[index];
                          return GestureDetector(
                            onTap: () => context.go('/live/${stream['id']}'),
                            child: LiveStreamCard(
                              data: LiveCardData(
                                name: stream['title'] as String? ?? 'Stream',
                                viewers: (stream['viewerCount'] as num?)?.toInt() ?? 0,
                                category: stream['category'] as String? ?? 'general',
                                isLive: stream['status'] == 'live',
                                vipLevel: 0,
                                type: ContentType.live,
                                gradientIndex: index,
                              ),
                              animationIndex: index,
                            ),
                          );
                        },
                        childCount: streams.length,
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
