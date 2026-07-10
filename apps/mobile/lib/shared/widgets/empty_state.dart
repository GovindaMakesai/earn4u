import 'package:flutter/material.dart';
import 'package:phosphoricons_flutter/phosphoricons_flutter.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import 'premium_button.dart';

class EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String? actionLabel;
  final VoidCallback? onAction;

  const EmptyState({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    this.actionLabel,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xxxl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 88,
              height: 88,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [
                    AppColors.premiumPurple.withValues(alpha: 0.2),
                    AppColors.electricBlue.withValues(alpha: 0.1),
                  ],
                ),
              ),
              child: Icon(icon, size: 40, color: AppColors.premiumPurpleLight),
            ),
            const SizedBox(height: AppSpacing.xxl),
            Text(title, style: Theme.of(context).textTheme.headlineMedium, textAlign: TextAlign.center),
            const SizedBox(height: AppSpacing.sm),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            if (actionLabel != null && onAction != null) ...[
              const SizedBox(height: AppSpacing.xxl),
              PremiumButton(label: actionLabel!, onPressed: onAction),
            ],
          ],
        ),
      ),
    );
  }
}

class MessagesEmptyState extends StatelessWidget {
  const MessagesEmptyState({super.key});

  @override
  Widget build(BuildContext context) {
    return const EmptyState(
      icon: PhosphorIcons.chatCircleDotsBold,
      title: 'No messages yet',
      subtitle: 'Start a conversation with creators you follow',
      actionLabel: 'Discover creators',
    );
  }
}
