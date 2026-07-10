import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_animations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/glass_surface.dart';
import '../../../shared/widgets/premium_button.dart';
import '../../shell/main_shell.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.gradientHero),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.xxl),
            child: Column(
              children: [
                const Spacer(flex: 2),
                const Earn4UBrand()
                    .animate()
                    .fadeIn(duration: AppAnimations.entrance)
                    .slideY(begin: -0.1, end: 0),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  'Socialize. Create. Earn.',
                  style: Theme.of(context).textTheme.bodyLarge,
                ).animate().fadeIn(delay: 100.ms),
                const Spacer(flex: 3),
                GlassSurface(
                  child: Column(
                    children: [
                      TextField(
                        controller: _emailController,
                        style: const TextStyle(color: AppColors.textPrimary),
                        decoration: InputDecoration(
                          labelText: 'Email',
                          labelStyle: const TextStyle(color: AppColors.textTertiary),
                          prefixIcon: Icon(Icons.email_outlined, color: AppColors.textTertiary, size: 20),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                            borderSide: const BorderSide(color: AppColors.borderSubtle),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                            borderSide: const BorderSide(color: AppColors.electricBlue),
                          ),
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: AppSpacing.lg),
                      TextField(
                        controller: _passwordController,
                        style: const TextStyle(color: AppColors.textPrimary),
                        obscureText: true,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          labelStyle: const TextStyle(color: AppColors.textTertiary),
                          prefixIcon: Icon(Icons.lock_outline, color: AppColors.textTertiary, size: 20),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                            borderSide: const BorderSide(color: AppColors.borderSubtle),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                            borderSide: const BorderSide(color: AppColors.electricBlue),
                          ),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xxl),
                      PremiumButton(
                        label: 'Sign In',
                        expanded: true,
                        isLoading: _isLoading,
                        onPressed: () {
                          setState(() => _isLoading = true);
                          Future.delayed(const Duration(milliseconds: 800), () {
                            if (mounted) {
                              setState(() => _isLoading = false);
                              context.go('/');
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.08, end: 0),
                const SizedBox(height: AppSpacing.lg),
                TextButton(
                  onPressed: () => context.go('/'),
                  child: Text(
                    'Continue as Guest',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.electricBlueLight),
                  ),
                ),
                const Spacer(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
