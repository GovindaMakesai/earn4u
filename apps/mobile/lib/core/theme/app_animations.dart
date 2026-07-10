import 'package:flutter/animation.dart';

class AppAnimations {
  AppAnimations._();

  // Durations
  static const Duration fast = Duration(milliseconds: 150);
  static const Duration normal = Duration(milliseconds: 250);
  static const Duration slow = Duration(milliseconds: 400);
  static const Duration entrance = Duration(milliseconds: 350);

  // Curves — subtle, expensive-feeling
  static const Curve standard = Curves.easeOutCubic;
  static const Curve decelerate = Curves.easeOut;
  static const Curve emphasis = Curves.easeInOutCubic;

  // Stagger delays for lists
  static Duration stagger(int index) => Duration(milliseconds: 40 * index.clamp(0, 8));
}
