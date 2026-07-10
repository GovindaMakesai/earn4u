import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:phosphoricons_flutter/phosphoricons_flutter.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/avatar_frame.dart';
import '../../../shared/widgets/glass_surface.dart';

class VoiceRoomScreen extends StatefulWidget {
  final String roomId;

  const VoiceRoomScreen({super.key, required this.roomId});

  @override
  State<VoiceRoomScreen> createState() => _VoiceRoomScreenState();
}

class _VoiceRoomScreenState extends State<VoiceRoomScreen> with TickerProviderStateMixin {
  late final List<AnimationController> _speakingControllers;
  final _seats = List.generate(8, (i) => _SeatData(
        name: i == 0 ? 'Host' : 'Seat ${i + 1}',
        isHost: i == 0,
        isSpeaking: i == 0 || i == 2,
        isMuted: i == 4,
      ));

  @override
  void initState() {
    super.initState();
    _speakingControllers = List.generate(
      8,
      (i) => AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))..repeat(),
    );
  }

  @override
  void dispose() {
    for (final c in _speakingControllers) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.richBlack,
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.gradientHero),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Row(
                  children: [
                    GestureDetector(
                      onTap: () => context.pop(),
                      child: Icon(PhosphorIcons.xBold, color: AppColors.textPrimary, size: 22),
                    ),
                    const Spacer(),
                    Column(
                      children: [
                        Text(widget.roomId, style: Theme.of(context).textTheme.headlineSmall),
                        Text('342 listening', style: Theme.of(context).textTheme.bodySmall),
                      ],
                    ),
                    const Spacer(),
                    Icon(PhosphorIcons.shareNetworkBold, color: AppColors.textSecondary, size: 22),
                  ],
                ),
              ),

              // Host spotlight
              GlassSurface(
                margin: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                child: Row(
                  children: [
                    _SeatAvatar(seat: _seats[0], controller: _speakingControllers[0], size: 64),
                    const SizedBox(width: AppSpacing.lg),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text('Host', style: Theme.of(context).textTheme.titleLarge),
                              const SizedBox(width: AppSpacing.sm),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  gradient: AppColors.gradientGold,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text('HOST', style: TextStyle(color: AppColors.richBlack, fontSize: 9, fontWeight: FontWeight.w800)),
                              ),
                            ],
                          ),
                          Text('Welcome to ${widget.roomId}', style: Theme.of(context).textTheme.bodySmall),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.xxl),

              // Seat grid
              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 4,
                    mainAxisSpacing: AppSpacing.lg,
                    crossAxisSpacing: AppSpacing.lg,
                  ),
                  itemCount: _seats.length,
                  itemBuilder: (context, i) => _SeatTile(
                    seat: _seats[i],
                    controller: _speakingControllers[i],
                  ),
                ),
              ),

              // Audience bar
              GlassSurface(
                margin: const EdgeInsets.fromLTRB(AppSpacing.lg, 0, AppSpacing.lg, AppSpacing.lg),
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.md),
                child: Row(
                  children: [
                    ...List.generate(4, (i) => Padding(
                          padding: const EdgeInsets.only(right: -8),
                          child: AvatarFrame(initials: 'U$i', size: 28),
                        )),
                    const SizedBox(width: AppSpacing.md),
                    Text('+338 more', style: Theme.of(context).textTheme.bodySmall),
                    const Spacer(),
                    _MicButton(isMuted: false),
                    const SizedBox(width: AppSpacing.md),
                    _MicButton(isMuted: true, isActive: true),
                    const SizedBox(width: AppSpacing.md),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        gradient: AppColors.gradientPrimary,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(PhosphorIcons.giftBold, color: Colors.white, size: 20),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SeatData {
  final String name;
  final bool isHost;
  final bool isSpeaking;
  final bool isMuted;

  const _SeatData({
    required this.name,
    required this.isHost,
    required this.isSpeaking,
    required this.isMuted,
  });
}

class _SeatTile extends StatelessWidget {
  final _SeatData seat;
  final AnimationController controller;

  const _SeatTile({required this.seat, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _SeatAvatar(seat: seat, controller: controller, size: 52),
        const SizedBox(height: 6),
        Text(
          seat.name,
          style: Theme.of(context).textTheme.labelSmall,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }
}

class _SeatAvatar extends StatelessWidget {
  final _SeatData seat;
  final AnimationController controller;
  final double size;

  const _SeatAvatar({required this.seat, required this.controller, required this.size});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        final pulse = seat.isSpeaking && !seat.isMuted ? 1.0 + sin(controller.value * 2 * pi) * 0.08 : 1.0;
        return Transform.scale(
          scale: pulse,
          child: Stack(
            alignment: Alignment.center,
            children: [
              if (seat.isSpeaking && !seat.isMuted)
                Container(
                  width: size + 16,
                  height: size + 16,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppColors.premiumPurple.withValues(alpha: 0.4 + sin(controller.value * 2 * pi) * 0.3),
                      width: 2,
                    ),
                  ),
                ),
              AvatarFrame(
                initials: seat.name,
                size: size,
                vipLevel: seat.isHost ? 12 : 0,
                gradientColors: seat.isHost ? [AppColors.gold, AppColors.premiumPurple] : null,
              ),
              if (seat.isMuted)
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(color: AppColors.error, shape: BoxShape.circle),
                    child: Icon(PhosphorIcons.microphoneSlashBold, color: Colors.white, size: size * 0.2),
                  ),
                ),
              if (seat.isSpeaking && !seat.isMuted)
                Positioned(
                  top: 0,
                  right: 0,
                  child: Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      color: AppColors.online,
                      shape: BoxShape.circle,
                      boxShadow: [BoxShadow(color: AppColors.online.withValues(alpha: 0.6), blurRadius: 6)],
                    ),
                  ).animate(onPlay: (c) => c.repeat()).scale(begin: const Offset(0.8, 0.8), end: const Offset(1.2, 1.2), duration: 800.ms),
                ),
            ],
          ),
        );
      },
    );
  }
}

class _MicButton extends StatelessWidget {
  final bool isMuted;
  final bool isActive;

  const _MicButton({required this.isMuted, this.isActive = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isActive ? AppColors.electricBlue.withValues(alpha: 0.2) : AppColors.surface,
        shape: BoxShape.circle,
        border: Border.all(color: isActive ? AppColors.electricBlue : AppColors.borderSubtle),
      ),
      child: Icon(
        isMuted ? PhosphorIcons.microphoneSlashBold : PhosphorIcons.microphoneBold,
        color: isActive ? AppColors.electricBlueLight : AppColors.textSecondary,
        size: 20,
      ),
    );
  }
}
