import 'package:flutter/material.dart';

/// Earn4U premium dark-first color system.
/// Rich black foundations with electric blue, premium purple, and gold accents.
class AppColors {
  AppColors._();

  // ─── Foundations ───────────────────────────────────────────
  static const Color richBlack = Color(0xFF050508);
  static const Color deepCharcoal = Color(0xFF0C0C12);
  static const Color elevated = Color(0xFF14141C);
  static const Color surface = Color(0xFF1C1C28);
  static const Color surfaceHigh = Color(0xFF252532);
  static const Color border = Color(0xFF2A2A3A);
  static const Color borderSubtle = Color(0x14FFFFFF);

  // ─── Accents ───────────────────────────────────────────────
  static const Color electricBlue = Color(0xFF3B82F6);
  static const Color electricBlueLight = Color(0xFF60A5FA);
  static const Color premiumPurple = Color(0xFF7C3AED);
  static const Color premiumPurpleLight = Color(0xFF9D6FF7);
  static const Color gold = Color(0xFFEAB308);
  static const Color goldMuted = Color(0xFFD4A853);
  static const Color goldLight = Color(0xFFFDE68A);

  // ─── Semantic ──────────────────────────────────────────────
  static const Color live = Color(0xFFEF4444);
  static const Color liveGlow = Color(0x66EF4444);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color online = Color(0xFF22D3EE);

  // ─── Text ──────────────────────────────────────────────────
  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textTertiary = Color(0xFF64748B);
  static const Color textDisabled = Color(0xFF475569);

  // ─── Glass ─────────────────────────────────────────────────
  static const Color glassFill = Color(0xB314141C);
  static const Color glassBorder = Color(0x1AFFFFFF);

  // ─── Gradients ─────────────────────────────────────────────
  static const LinearGradient gradientHero = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF1E1B4B), Color(0xFF0C0C12), Color(0xFF050508)],
    stops: [0.0, 0.5, 1.0],
  );

  static const LinearGradient gradientPrimary = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [electricBlue, premiumPurple],
  );

  static const LinearGradient gradientGold = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFB8860B), gold, goldLight],
  );

  static const LinearGradient gradientLive = LinearGradient(
    begin: Alignment.bottomCenter,
    end: Alignment.topCenter,
    colors: [Color(0xE6050508), Color(0x66050508), Colors.transparent],
    stops: [0.0, 0.35, 1.0],
  );

  static const LinearGradient gradientCard = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF1A1A2E), Color(0xFF14141C)],
  );

  static const LinearGradient gradientVip = LinearGradient(
    colors: [goldMuted, premiumPurple, goldMuted],
  );

  // Card thumbnail gradients (deterministic variety)
  static List<Color> cardGradient(int index) {
    const palettes = [
      [Color(0xFF1E3A5F), Color(0xFF0C1929)],
      [Color(0xFF2D1B4E), Color(0xFF140C24)],
      [Color(0xFF1B3D2F), Color(0xFF0C1F18)],
      [Color(0xFF3D1B2E), Color(0xFF1F0C16)],
      [Color(0xFF1B2D3D), Color(0xFF0C161F)],
      [Color(0xFF3D2E1B), Color(0xFF1F160C)],
    ];
    return palettes[index % palettes.length];
  }
}
