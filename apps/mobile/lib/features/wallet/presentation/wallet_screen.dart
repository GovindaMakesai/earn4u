import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/data/app_repository.dart';
import '../../../core/theme/app_animations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_shadows.dart';
import '../../../core/theme/app_typography.dart';
import '../../../shared/widgets/glass_surface.dart';
import '../../../shared/widgets/premium_button.dart';

class WalletScreen extends ConsumerStatefulWidget {
  const WalletScreen({super.key});

  @override
  ConsumerState<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends ConsumerState<WalletScreen> {
  int _selectedPackage = 0;

  @override
  Widget build(BuildContext context) {
    final walletAsync = ref.watch(walletProvider);
    final packagesAsync = ref.watch(coinPackagesProvider);

    return Scaffold(
      backgroundColor: AppColors.richBlack,
      appBar: AppBar(
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.pop()),
        title: Text('Wallet & Store', style: Theme.of(context).textTheme.headlineMedium),
      ),
      body: walletAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Failed to load wallet: $e')),
        data: (wallet) {
          final coins = (wallet['coinsBalance'] as num?)?.toInt() ?? 0;
          final diamonds = (wallet['diamondsBalance'] as num?)?.toInt() ?? 0;

          return ListView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            children: [
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
                    Text('$coins', style: AppTypography.stat.copyWith(color: Colors.white, fontSize: 36))
                        .animate()
                        .fadeIn(duration: AppAnimations.entrance),
                    const Text('coins', style: TextStyle(color: Colors.white70)),
                    const SizedBox(height: AppSpacing.md),
                    Text('$diamonds diamonds', style: const TextStyle(color: Colors.white70)),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xxl),
              packagesAsync.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => Text('Packages unavailable: $e'),
                data: (packages) {
                  if (packages.isEmpty) {
                    return const Text('No coin packages available', style: TextStyle(color: AppColors.textSecondary));
                  }
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Coin Packages', style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: AppSpacing.md),
                      ...List.generate(packages.length, (i) {
                        final pkg = packages[i];
                        final selected = _selectedPackage == i;
                        return Padding(
                          padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                          child: GlassSurface(
                            child: ListTile(
                              selected: selected,
                              onTap: () => setState(() => _selectedPackage = i),
                              title: Text(pkg['name'] as String? ?? 'Package'),
                              subtitle: Text('${pkg['coinsAmount']} coins'),
                              trailing: Text('\$${pkg['priceUsd']}'),
                            ),
                          ),
                        );
                      }),
                      PremiumButton(
                        label: 'Purchase (API pending)',
                        expanded: true,
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('POST /wallet/purchase not implemented on backend yet')),
                          );
                        },
                      ),
                    ],
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }
}
