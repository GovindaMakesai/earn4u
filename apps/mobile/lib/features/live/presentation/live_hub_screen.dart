import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphoricons_flutter/phosphoricons_flutter.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_shadows.dart';

class LiveHubScreen extends StatelessWidget {
  const LiveHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.richBlack,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.close, color: AppColors.textPrimary),
          onPressed: () => context.pop(),
        ),
        title: Text('Go Live', style: Theme.of(context).textTheme.headlineMedium),
      ),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          children: [
            _LiveOption(
              icon: PhosphorIcons.videoCameraBold,
              title: 'Video Live',
              subtitle: 'Stream to thousands of viewers',
              gradient: AppColors.gradientPrimary,
              onTap: () => context.push('/live/new'),
            ),
            const SizedBox(height: AppSpacing.lg),
            _LiveOption(
              icon: PhosphorIcons.microphoneBold,
              title: 'Voice Room',
              subtitle: 'Host an audio party with seats',
              gradient: const LinearGradient(colors: [AppColors.premiumPurple, Color(0xFF4C1D95)]),
              onTap: () => context.push('/voice/new'),
            ),
            const SizedBox(height: AppSpacing.lg),
            _LiveOption(
              icon: PhosphorIcons.swordBold,
              title: 'PK Battle',
              subtitle: 'Challenge another creator live',
              gradient: const LinearGradient(colors: [Color(0xFFDC2626), Color(0xFF7C2D12)]),
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }
}

class _LiveOption extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Gradient gradient;
  final VoidCallback onTap;

  const _LiveOption({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.gradient,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 100,
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          boxShadow: AppShadows.glowBlue,
        ),
        padding: const EdgeInsets.all(AppSpacing.xxl),
        child: Row(
          children: [
            Icon(icon, color: Colors.white, size: 32),
            const SizedBox(width: AppSpacing.lg),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(title, style: Theme.of(context).textTheme.titleLarge?.copyWith(color: Colors.white)),
                  Text(subtitle, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.white70)),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios, color: Colors.white54, size: 16),
          ],
        ),
      ),
    );
  }
}
