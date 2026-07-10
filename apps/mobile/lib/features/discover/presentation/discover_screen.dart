import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/demo_content.dart';
import '../../../core/data/app_repository.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/shell_metrics.dart';
import '../../../shared/widgets/live_stream_card.dart';

class DiscoverScreen extends ConsumerWidget {
  const DiscoverScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final streamsAsync = ref.watch(streamsProvider);

    return Scaffold(
      backgroundColor: AppColors.richBlack,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            title: Text('Discover', style: Theme.of(context).textTheme.headlineLarge),
            backgroundColor: AppColors.richBlack,
          ),
          streamsAsync.when(
            loading: () => const SliverFillRemaining(child: Center(child: CircularProgressIndicator())),
            error: (e, _) => SliverFillRemaining(child: Center(child: Text('Error: $e'))),
            data: (streams) => SliverPadding(
              padding: EdgeInsets.fromLTRB(
                AppSpacing.lg,
                AppSpacing.lg,
                AppSpacing.lg,
                ShellMetrics.scrollBottomPadding(context),
              ),
              sliver: streams.isEmpty
                  ? const SliverFillRemaining(
                      child: Center(child: Text('No streams to discover', style: TextStyle(color: AppColors.textSecondary))),
                    )
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
                                category: stream['category'] as String? ?? 'general',
                                viewers: (stream['viewerCount'] as num?)?.toInt() ?? 0,
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
