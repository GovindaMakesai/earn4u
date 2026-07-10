import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app_colors.dart';
import 'app_typography.dart';
import 'app_spacing.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get dark {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.richBlack,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.electricBlue,
        secondary: AppColors.premiumPurple,
        tertiary: AppColors.gold,
        surface: AppColors.elevated,
        error: AppColors.error,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.textPrimary,
      ),
      textTheme: AppTypography.textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        systemOverlayStyle: SystemUiOverlayStyle.light,
        titleTextStyle: AppTypography.textTheme.headlineMedium,
        iconTheme: const IconThemeData(color: AppColors.textPrimary, size: 22),
      ),
      dividerTheme: const DividerThemeData(color: AppColors.borderSubtle, thickness: 1),
      splashFactory: InkSparkle.splashFactory,
      highlightColor: AppColors.electricBlue.withValues(alpha: 0.08),
      splashColor: AppColors.electricBlue.withValues(alpha: 0.12),
    );
  }
}
