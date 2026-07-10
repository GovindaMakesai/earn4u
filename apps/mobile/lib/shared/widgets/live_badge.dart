import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

class LiveBadge extends StatelessWidget {
  final bool compact;

  const LiveBadge({super.key, this.compact = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: compact ? 6 : 8,
        vertical: compact ? 2 : 4,
      ),
      decoration: BoxDecoration(
        color: AppColors.live,
        borderRadius: BorderRadius.circular(compact ? 4 : 6),
        boxShadow: [
          BoxShadow(color: AppColors.live.withValues(alpha: 0.5), blurRadius: 8),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: compact ? 5 : 6,
            height: compact ? 5 : 6,
            decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
          )
              .animate(onPlay: (c) => c.repeat())
              .fade(duration: 800.ms)
              .then()
              .fade(begin: 1, end: 0.4, duration: 800.ms),
          SizedBox(width: compact ? 4 : 5),
          Text(
            'LIVE',
            style: TextStyle(
              color: Colors.white,
              fontSize: compact ? 9 : 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.8,
            ),
          ),
        ],
      ),
    );
  }
}

class ViewerCount extends StatelessWidget {
  final int count;

  const ViewerCount({super.key, required this.count});

  String get _formatted {
    if (count >= 1000000) return '${(count / 1000000).toStringAsFixed(1)}M';
    if (count >= 1000) return '${(count / 1000).toStringAsFixed(1)}K';
    return count.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.55),
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.remove_red_eye_outlined, color: Colors.white, size: 12),
          const SizedBox(width: 4),
          Text(
            _formatted,
            style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}
