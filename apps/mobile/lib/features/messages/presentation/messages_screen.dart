import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/constants/demo_content.dart';
import '../../../core/theme/app_animations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/avatar_frame.dart';
import '../../../shared/widgets/empty_state.dart';

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.richBlack,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            title: Text('Messages', style: Theme.of(context).textTheme.headlineLarge),
            backgroundColor: AppColors.richBlack,
            actions: [
              IconButton(icon: const Icon(Icons.edit_outlined), onPressed: () {}),
            ],
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, i) {
                final msg = DemoContent.messages[i];
                return _MessageTile(
                  name: msg.$1,
                  preview: msg.$2,
                  time: msg.$3,
                  hasUnread: msg.$4,
                  index: i,
                );
              },
              childCount: DemoContent.messages.length,
            ),
          ),
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.all(AppSpacing.lg),
              child: EmptyState(
                icon: Icons.chat_bubble_outline,
                title: 'All caught up',
                subtitle: 'Start a conversation with your favorite creators',
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

class _MessageTile extends StatelessWidget {
  final String name;
  final String preview;
  final String time;
  final bool hasUnread;
  final int index;

  const _MessageTile({
    required this.name,
    required this.preview,
    required this.time,
    required this.hasUnread,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {},
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
          child: Row(
            children: [
              AvatarFrame(initials: name, size: 52, vipLevel: hasUnread ? 8 : 0, showOnline: hasUnread),
              const SizedBox(width: AppSpacing.lg),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            name,
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: hasUnread ? FontWeight.w700 : FontWeight.w600,
                                ),
                          ),
                        ),
                        Text(time, style: Theme.of(context).textTheme.labelSmall),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      preview,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: hasUnread ? AppColors.textPrimary : AppColors.textTertiary,
                            fontWeight: hasUnread ? FontWeight.w500 : FontWeight.w400,
                          ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              if (hasUnread)
                Container(
                  width: 10,
                  height: 10,
                  margin: const EdgeInsets.only(left: AppSpacing.sm),
                  decoration: const BoxDecoration(color: AppColors.electricBlue, shape: BoxShape.circle),
                ),
            ],
          ),
        ),
      ),
    )
        .animate()
        .fadeIn(delay: AppAnimations.stagger(index))
        .slideX(begin: 0.04, end: 0, duration: AppAnimations.normal);
  }
}
