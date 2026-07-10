import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/data/app_repository.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/glass_surface.dart';

class GiftsShowcaseScreen extends ConsumerWidget {
  const GiftsShowcaseScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final giftsAsync = ref.watch(giftsProvider);

    return Scaffold(
      backgroundColor: AppColors.richBlack,
      appBar: AppBar(
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.pop()),
        title: Text('Gift Gallery', style: Theme.of(context).textTheme.headlineMedium),
      ),
      body: giftsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Failed to load gifts: $e')),
        data: (gifts) {
          if (gifts.isEmpty) {
            return const Center(child: Text('No gifts in catalog', style: TextStyle(color: AppColors.textSecondary)));
          }
          return GridView.builder(
            padding: const EdgeInsets.all(AppSpacing.lg),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: AppSpacing.md,
              crossAxisSpacing: AppSpacing.md,
              childAspectRatio: 1.1,
            ),
            itemCount: gifts.length,
            itemBuilder: (context, index) {
              final gift = gifts[index];
              return GlassSurface(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(gift['name'] as String? ?? 'Gift', style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: AppSpacing.sm),
                    Text('${gift['coinPrice']} coins', style: const TextStyle(color: AppColors.gold)),
                    Text(gift['category'] as String? ?? '', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
