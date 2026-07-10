import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphoricons_flutter/phosphoricons_flutter.dart';
import '../../../core/constants/demo_content.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/avatar_frame.dart';
import '../../../shared/widgets/glass_surface.dart';
import '../../../shared/widgets/live_badge.dart';

class LiveStreamScreen extends StatefulWidget {
  final String streamId;

  const LiveStreamScreen({super.key, required this.streamId});

  @override
  State<LiveStreamScreen> createState() => _LiveStreamScreenState();
}

class _LiveStreamScreenState extends State<LiveStreamScreen> with TickerProviderStateMixin {
  final _chatController = TextEditingController();
  late final AnimationController _giftController;

  @override
  void initState() {
    super.initState();
    _giftController = AnimationController(vsync: this, duration: const Duration(seconds: 3))..repeat();
  }

  @override
  void dispose() {
    _chatController.dispose();
    _giftController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.cardGradient(widget.streamId.hashCode);

    return Scaffold(
      backgroundColor: AppColors.richBlack,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Video background simulation
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: colors,
              ),
            ),
          ),
          DecoratedBox(decoration: const BoxDecoration(gradient: AppColors.gradientLive)),

          // Floating reactions
          ...List.generate(3, (i) => Positioned(
                right: 16 + i * 8.0,
                bottom: 200 + i * 40.0,
                child: _FloatingReaction(index: i),
              )),

          // Top bar
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => context.pop(),
                    child: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  AvatarFrame(initials: widget.streamId, size: 36, vipLevel: 12),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(widget.streamId, style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.white)),
                        const LiveBadge(compact: true),
                      ],
                    ),
                  ),
                  ViewerCount(count: 12400),
                  const SizedBox(width: AppSpacing.sm),
                  Icon(PhosphorIcons.dotsThreeVerticalBold, color: Colors.white, size: 22),
                ],
              ),
            ),
          ),

          // PK overlay (when applicable)
          Positioned(
            top: 100,
            left: AppSpacing.lg,
            right: AppSpacing.lg,
            child: GlassSurface(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Row(
                children: [
                  Expanded(child: _PkScore(name: widget.streamId, score: 8420, isLeading: true)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: AppColors.gradientPrimary,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text('PK', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 12)),
                  ),
                  Expanded(child: _PkScore(name: 'Storm', score: 7100, isLeading: false)),
                ],
              ),
            ),
          ),

          // Chat + controls
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Chat messages
                SizedBox(
                  height: 160,
                  child: ListView(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                    children: const [
                      _ChatBubble(user: 'Fan_42', message: 'Amazing stream! 🔥'),
                      _ChatBubble(user: 'VIP_User', message: 'Sent Sports Car 🏎️', isVip: true),
                      _ChatBubble(user: 'Luna', message: 'Thanks everyone!'),
                    ],
                  ),
                ),
                // Gift tray
                SizedBox(
                  height: 72,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                    itemCount: DemoContent.gifts.length,
                    itemBuilder: (context, i) {
                      final gift = DemoContent.gifts[i];
                      return _GiftItem(name: gift.$1, price: gift.$2, isPremium: gift.$3 != 'standard');
                    },
                  ),
                ),
                // Input bar
                Padding(
                  padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.sm, AppSpacing.lg, AppSpacing.lg),
                  child: Row(
                    children: [
                      Expanded(
                        child: GlassSurface(
                          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
                          child: TextField(
                            controller: _chatController,
                            style: const TextStyle(color: Colors.white, fontSize: 14),
                            decoration: const InputDecoration(
                              hintText: 'Say something...',
                              hintStyle: TextStyle(color: AppColors.textTertiary),
                              border: InputBorder.none,
                              isDense: true,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      _ActionButton(icon: PhosphorIcons.heartBold, color: AppColors.live),
                      const SizedBox(width: AppSpacing.sm),
                      _ActionButton(icon: PhosphorIcons.giftBold, color: AppColors.gold),
                      const SizedBox(width: AppSpacing.sm),
                      _ActionButton(icon: PhosphorIcons.shareNetworkBold, color: AppColors.electricBlue),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Gift animation overlay
          AnimatedBuilder(
            animation: _giftController,
            builder: (context, child) {
              final t = _giftController.value;
              if (t < 0.1) return const SizedBox.shrink();
              return Center(
                child: Opacity(
                  opacity: (1 - t).clamp(0.0, 1.0),
                  child: Transform.scale(
                    scale: 0.8 + t * 0.4,
                    child: Text('🏎️', style: TextStyle(fontSize: 80 + t * 40)),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _PkScore extends StatelessWidget {
  final String name;
  final int score;
  final bool isLeading;

  const _PkScore({required this.name, required this.score, required this.isLeading});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(name, style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 12)),
        Text(
          score.toString(),
          style: TextStyle(
            color: isLeading ? AppColors.gold : Colors.white70,
            fontWeight: FontWeight.w800,
            fontSize: 18,
          ),
        ),
      ],
    );
  }
}

class _ChatBubble extends StatelessWidget {
  final String user;
  final String message;
  final bool isVip;

  const _ChatBubble({required this.user, required this.message, this.isVip = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: GlassSurface(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        borderRadius: 12,
        child: RichText(
          text: TextSpan(
            children: [
              TextSpan(
                text: '$user: ',
                style: TextStyle(
                  color: isVip ? AppColors.gold : AppColors.electricBlueLight,
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                ),
              ),
              TextSpan(
                text: message,
                style: const TextStyle(color: Colors.white, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _GiftItem extends StatelessWidget {
  final String name;
  final int price;
  final bool isPremium;

  const _GiftItem({required this.name, required this.price, required this.isPremium});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 64,
      margin: const EdgeInsets.only(right: AppSpacing.sm),
      decoration: BoxDecoration(
        gradient: isPremium ? AppColors.gradientGold : AppColors.gradientCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isPremium ? AppColors.gold.withValues(alpha: 0.4) : AppColors.glassBorder),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(_emoji(name), style: const TextStyle(fontSize: 22)),
          Text(name, style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.w600), maxLines: 1),
          Text('$price', style: TextStyle(color: isPremium ? AppColors.gold : AppColors.textTertiary, fontSize: 9)),
        ],
      ),
    );
  }

  String _emoji(String name) {
    return switch (name) {
      'Rose' => '🌹',
      'Sports Car' => '🏎️',
      'Private Jet' => '✈️',
      'Dragon' => '🐉',
      'Yacht' => '🛥️',
      'Rocket' => '🚀',
      _ => '🎁',
    };
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final Color color;

  const _ActionButton({required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.2),
        shape: BoxShape.circle,
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Icon(icon, color: color, size: 20),
    );
  }
}

class _FloatingReaction extends StatelessWidget {
  final int index;

  const _FloatingReaction({required this.index});

  @override
  Widget build(BuildContext context) {
    const emojis = ['❤️', '🔥', '👏'];
    return Text(emojis[index % emojis.length], style: const TextStyle(fontSize: 24))
        .animate(onPlay: (c) => c.repeat())
        .fadeIn(duration: 600.ms)
        .then()
        .moveY(begin: 0, end: -60, duration: 2000.ms)
        .then()
        .fadeOut(duration: 400.ms);
  }
}
