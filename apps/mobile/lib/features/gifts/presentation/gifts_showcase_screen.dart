import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/demo_content.dart';
import '../../../core/theme/app_animations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_shadows.dart';
import '../../../shared/widgets/glass_surface.dart';

class GiftsShowcaseScreen extends StatefulWidget {
  const GiftsShowcaseScreen({super.key});

  @override
  State<GiftsShowcaseScreen> createState() => _GiftsShowcaseScreenState();
}

class _GiftsShowcaseScreenState extends State<GiftsShowcaseScreen> with SingleTickerProviderStateMixin {
  int _selected = 2;
  late final AnimationController _comboController;

  @override
  void initState() {
    super.initState();
    _comboController = AnimationController(vsync: this, duration: const Duration(seconds: 2));
  }

  @override
  void dispose() {
    _comboController.dispose();
    super.dispose();
  }

  void _playCombo() {
    _comboController.forward(from: 0);
  }

  @override
  Widget build(BuildContext context) {
    final gift = DemoContent.gifts[_selected];

    return Scaffold(
      backgroundColor: AppColors.richBlack,
      appBar: AppBar(
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.pop()),
        title: Text('Gift Gallery', style: Theme.of(context).textTheme.headlineMedium),
      ),
      body: Stack(
        children: [
          Column(
            children: [
              // Hero showcase
              Expanded(
                flex: 3,
                child: Container(
                  width: double.infinity,
                  margin: const EdgeInsets.all(AppSpacing.lg),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        AppColors.premiumPurple.withValues(alpha: 0.3),
                        AppColors.richBlack,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
                    border: Border.all(color: AppColors.glassBorder),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(_emoji(gift.$1), style: const TextStyle(fontSize: 80))
                          .animate(key: ValueKey(_selected))
                          .fadeIn(duration: 400.ms)
                          .scale(begin: const Offset(0.5, 0.5), curve: AppAnimations.standard),
                      const SizedBox(height: AppSpacing.lg),
                      Text(gift.$1, style: Theme.of(context).textTheme.headlineLarge),
                      Text('${gift.$2} coins', style: Theme.of(context).textTheme.titleMedium?.copyWith(color: AppColors.gold)),
                      if (gift.$3 == 'event')
                        Container(
                          margin: const EdgeInsets.only(top: AppSpacing.sm),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            gradient: AppColors.gradientGold,
                            borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                          ),
                          child: const Text('LIMITED EVENT', style: TextStyle(color: AppColors.richBlack, fontSize: 10, fontWeight: FontWeight.w800)),
                        ),
                    ],
                  ),
                ),
              ),

              // Gift grid
              Expanded(
                flex: 2,
                child: GridView.builder(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    mainAxisSpacing: AppSpacing.md,
                    crossAxisSpacing: AppSpacing.md,
                    childAspectRatio: 0.9,
                  ),
                  itemCount: DemoContent.gifts.length,
                  itemBuilder: (context, i) {
                    final g = DemoContent.gifts[i];
                    final isSelected = _selected == i;
                    final isPremium = g.$3 != 'standard';
                    return GestureDetector(
                      onTap: () => setState(() => _selected = i),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        decoration: BoxDecoration(
                          gradient: isPremium ? AppColors.gradientCard : null,
                          color: isPremium ? null : AppColors.surface,
                          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                          border: Border.all(color: isSelected ? AppColors.gold : AppColors.borderSubtle, width: isSelected ? 2 : 1),
                          boxShadow: isSelected ? AppShadows.glowGold : null,
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(_emoji(g.$1), style: TextStyle(fontSize: isSelected ? 32 : 26)),
                            Text(g.$1, style: Theme.of(context).textTheme.labelMedium, maxLines: 1),
                            Text('${g.$2}', style: TextStyle(color: AppColors.gold, fontSize: 10, fontWeight: FontWeight.w600)),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Send bar
              Padding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: _playCombo,
                        child: GlassSurface(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text('🎁', style: TextStyle(fontSize: 20)),
                              const SizedBox(width: AppSpacing.sm),
                              Text('Send ${gift.$1}', style: Theme.of(context).textTheme.titleMedium),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    GestureDetector(
                      onTap: _playCombo,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
                        decoration: BoxDecoration(
                          gradient: AppColors.gradientGold,
                          borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                          boxShadow: AppShadows.glowGold,
                        ),
                        child: const Text('COMBO x5', style: TextStyle(color: AppColors.richBlack, fontWeight: FontWeight.w800, fontSize: 13)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Full-screen combo animation
          AnimatedBuilder(
            animation: _comboController,
            builder: (context, child) {
              if (_comboController.value == 0) return const SizedBox.shrink();
              final t = Curves.easeOutCubic.transform(_comboController.value);
              return IgnorePointer(
                child: Container(
                  color: AppColors.richBlack.withValues(alpha: (1 - t) * 0.7),
                  child: Center(
                    child: Opacity(
                      opacity: (1 - t).clamp(0.0, 1.0),
                      child: Transform.scale(
                        scale: 0.5 + t * 1.5,
                        child: Text(_emoji(gift.$1), style: const TextStyle(fontSize: 120)),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  String _emoji(String name) => switch (name) {
        'Rose' => '🌹',
        'Sports Car' => '🏎️',
        'Private Jet' => '✈️',
        'Dragon' => '🐉',
        'Yacht' => '🛥️',
        'Rocket' => '🚀',
        _ => '🎁',
      };
}
