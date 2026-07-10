import 'package:flutter/material.dart';
import 'app_spacing.dart';

class ShellMetrics {
  ShellMetrics._();

  static double bottomInset(BuildContext context) {
    return MediaQuery.viewPaddingOf(context).bottom;
  }

  static double navBarBottomMargin(BuildContext context) {
    return bottomInset(context) + AppSpacing.sm;
  }

  static double scrollBottomPadding(BuildContext context) {
    return AppSpacing.navHeight + navBarBottomMargin(context) + AppSpacing.lg;
  }
}
