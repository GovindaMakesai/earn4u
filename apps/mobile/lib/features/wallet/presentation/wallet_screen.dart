import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphoricons_flutter/phosphoricons_flutter.dart';
import '../../../core/constants/demo_content.dart';
import '../../../core/theme/app_animations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_shadows.dart';
import '../../../core/theme/app_typography.dart';
import '../../../shared/widgets/glass_surface.dart';
import '../../../shared/widgets/premium_button.dart';
import '../../../shared/widgets/stat_badge.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  int _selectedPackage = 1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.richBlack,
      appBar: AppBar(
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.pop()),
        title: Text('Wallet & Store', style: Theme.of(context).textTheme.headlineMedium),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          // Balance card
          Container(
            padding: const EdgeInsets.all(AppSpacing.xxl),
            decoration: BoxDecoration(
              gradient: AppColors.gradientPrimary,
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              boxShadow: AppShadows.glowPurple,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Your Balance', style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white70)),
                const SizedBox(height: AppSpacing.sm),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text('12,450', style: AppTypography.stat.copyWith(color: Colors.white, fontSize: 36))
                        .animate()
                        .fadeIn(duration: AppAnimations.entrance)
                        .slideY(begin: 0.1, end: 0),
                    const SizedBox(width: AppSpacing.sm),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Text('coins', style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.white70)),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.lg),
                Row(
                  children: [
                    _BalanceChip(icon: PhosphorIcons.arrowDownBold, label: 'Earned', value: '2,400'),
                    const SizedBox(width: AppSpacing.md),
                    _BalanceChip(icon: PhosphorIcons.arrowUpBold, label: 'Spent', value: '890'),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xxl),

          // VIP upgrade
          GlassSurface(
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  decoration: BoxDecoration(
                    gradient: AppColors.gradientVip,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(PhosphorIcons.crownBold, color: AppColors.richBlack, size: 24),
                ),
                const SizedBox(width: AppSpacing.lg),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Upgrade to VIP 12', style: Theme.of(context).textTheme.titleLarge),
                      Text('Exclusive frames, badges & perks', style: Theme.of(context).textTheme.bodySmall),
                    ],
                  ),
                ),
                const VipBadge(level: 12),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xxl),
          Text('Coin Packages', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: AppSpacing.md),

          ...List.generate(DemoContent.coinPackages.length, (i) {
            final pkg = DemoContent.coinPackages[i];
            final isSelected = _selectedPackage == i;
            return GestureDetector(
              onTap: () => setState(() => _selectedPackage = i),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(bottom: AppSpacing.md),
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  gradient: isSelected ? AppColors.gradientCard : null,
                  color: isSelected ? null : AppColors.surface,
                  borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                  border: Border.all(
                    color: isSelected ? AppColors.electricBlue : AppColors.borderSubtle,
                    width: isSelected ? 1.5 : 1,
                  ),
                  boxShadow: isSelected ? AppShadows.glowBlue : null,
                ),
                child: Row(
                  children: [
                    Text('🪙', style: TextStyle(fontSize: isSelected ? 28 : 24)),
                    const SizedBox(width: AppSpacing.lg),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(pkg.$1, style: Theme.of(context).textTheme.titleLarge),
                          Text(
                            '${pkg.$2} coins${pkg.$3 > 0 ? ' + ${pkg.$3} bonus' : ''}',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '\$${pkg.$4.toStringAsFixed(2)}',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: AppColors.gold),
                    ),
                  ],
                ),
              ),
            );
          }),

          const SizedBox(height: AppSpacing.lg),
          PremiumButton(
            label: 'Purchase',
            expanded: true,
            isGold: true,
            icon: PhosphorIcons.shieldCheckBold,
            onPressed: () {},
          ),
          const SizedBox(height: AppSpacing.huge),
        ],
      ),
    );
  }
}

class _BalanceChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _BalanceChip({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white70, size: 14),
          const SizedBox(width: 6),
          Text('$label $value', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
