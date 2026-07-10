import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/data/app_repository.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/shell_metrics.dart';
import '../../../shared/widgets/glass_surface.dart';

class MessagesScreen extends ConsumerWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversationsAsync = ref.watch(conversationsProvider);

    return Scaffold(
      backgroundColor: AppColors.richBlack,
      appBar: AppBar(
        title: Text('Messages', style: Theme.of(context).textTheme.headlineMedium),
        backgroundColor: AppColors.richBlack,
      ),
      body: conversationsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Failed to load messages: $e')),
        data: (conversations) {
          if (conversations.isEmpty) {
            return const Center(
              child: Text('No conversations yet', style: TextStyle(color: AppColors.textSecondary)),
            );
          }
          return ListView.separated(
            padding: EdgeInsets.fromLTRB(
              AppSpacing.lg,
              AppSpacing.lg,
              AppSpacing.lg,
              ShellMetrics.scrollBottomPadding(context),
            ),
            itemCount: conversations.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
            itemBuilder: (context, index) {
              final c = conversations[index];
              return GlassSurface(
                child: ListTile(
                  title: Text(c['title'] as String? ?? 'Conversation'),
                  subtitle: Text(c['lastMessage'] as String? ?? 'No messages'),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
