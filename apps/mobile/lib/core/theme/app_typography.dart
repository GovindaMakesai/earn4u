import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTypography {
  AppTypography._();

  static String get _display => 'Outfit';
  static String get _body => 'Plus Jakarta Sans';

  static TextTheme get textTheme => TextTheme(
        displayLarge: GoogleFonts.getFont(_display,
            fontSize: 32, fontWeight: FontWeight.w700, color: AppColors.textPrimary, height: 1.15, letterSpacing: -0.5),
        displayMedium: GoogleFonts.getFont(_display,
            fontSize: 28, fontWeight: FontWeight.w700, color: AppColors.textPrimary, height: 1.2, letterSpacing: -0.3),
        displaySmall: GoogleFonts.getFont(_display,
            fontSize: 24, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.25),
        headlineLarge: GoogleFonts.getFont(_display,
            fontSize: 22, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.3),
        headlineMedium: GoogleFonts.getFont(_display,
            fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.35),
        headlineSmall: GoogleFonts.getFont(_display,
            fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.4),
        titleLarge: GoogleFonts.getFont(_body,
            fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.4),
        titleMedium: GoogleFonts.getFont(_body,
            fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.4),
        titleSmall: GoogleFonts.getFont(_body,
            fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary, height: 1.4),
        bodyLarge: GoogleFonts.getFont(_body,
            fontSize: 16, fontWeight: FontWeight.w400, color: AppColors.textPrimary, height: 1.55),
        bodyMedium: GoogleFonts.getFont(_body,
            fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.textSecondary, height: 1.5),
        bodySmall: GoogleFonts.getFont(_body,
            fontSize: 12, fontWeight: FontWeight.w400, color: AppColors.textTertiary, height: 1.45),
        labelLarge: GoogleFonts.getFont(_body,
            fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary, letterSpacing: 0.1),
        labelMedium: GoogleFonts.getFont(_body,
            fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textSecondary, letterSpacing: 0.2),
        labelSmall: GoogleFonts.getFont(_body,
            fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textTertiary, letterSpacing: 0.4),
      );

  static TextStyle get brand => GoogleFonts.getFont(_display,
      fontSize: 26, fontWeight: FontWeight.w700, letterSpacing: -0.5);

  static TextStyle get stat => GoogleFonts.getFont(_display,
      fontSize: 28, fontWeight: FontWeight.w700, color: AppColors.textPrimary);

  static TextStyle get goldAccent => GoogleFonts.getFont(_body,
      fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.gold);
}
