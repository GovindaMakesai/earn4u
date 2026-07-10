import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../core/theme/app_animations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/glass_surface.dart';
import '../../../shared/widgets/premium_button.dart';
import '../../shell/main_shell.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _error;

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
                      if (_error != null) ...[
                        Text(_error!, style: const TextStyle(color: AppColors.live)),
                        const SizedBox(height: AppSpacing.md),
                      ],
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
                        onPressed: _signIn,
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.08, end: 0),
                const SizedBox(height: AppSpacing.lg),
                TextButton(
                  onPressed: _isLoading ? null : _guestLogin,
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

  Future<void> _signIn() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await ref.read(authProvider.notifier).login(
            _emailController.text.trim(),
            _passwordController.text,
          );
      if (mounted) context.go('/');
    } on DioException catch (e) {
      setState(() => _error = ref.read(apiClientProvider).apiErrorMessage(e, fallback: 'Login failed'));
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _guestLogin() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await ref.read(authProvider.notifier).guestLogin();
      if (mounted) context.go('/');
    } on DioException catch (e) {
      setState(() => _error = ref.read(apiClientProvider).apiErrorMessage(e, fallback: 'Guest login failed'));
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
