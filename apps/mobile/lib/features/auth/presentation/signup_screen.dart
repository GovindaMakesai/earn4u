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

class SignupScreen extends ConsumerStatefulWidget {
  const SignupScreen({super.key});

  @override
  ConsumerState<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends ConsumerState<SignupScreen> {
  final _emailController = TextEditingController();
  final _usernameController = TextEditingController();
  final _displayNameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _error;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.gradientHero),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.xxl),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: AppSpacing.xxl),
                const Earn4UBrand()
                    .animate()
                    .fadeIn(duration: AppAnimations.entrance)
                    .slideY(begin: -0.1, end: 0),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  'Create your account',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
                const SizedBox(height: AppSpacing.xxxl),
                GlassSurface(
                  child: Column(
                    children: [
                      if (_error != null) ...[
                        Text(_error!, style: const TextStyle(color: AppColors.live)),
                        const SizedBox(height: AppSpacing.md),
                      ],
                      _field(_displayNameController, 'Display name', Icons.badge_outlined),
                      const SizedBox(height: AppSpacing.lg),
                      _field(_usernameController, 'Username', Icons.alternate_email, hint: 'letters, numbers, underscore'),
                      const SizedBox(height: AppSpacing.lg),
                      _field(_emailController, 'Email', Icons.email_outlined, keyboard: TextInputType.emailAddress),
                      const SizedBox(height: AppSpacing.lg),
                      _field(
                        _passwordController,
                        'Password',
                        Icons.lock_outline,
                        obscure: true,
                        hint: 'Upper, lower, number, symbol (@\$!%*?&)',
                      ),
                      const SizedBox(height: AppSpacing.xxl),
                      PremiumButton(
                        label: 'Create Account',
                        expanded: true,
                        isLoading: _isLoading,
                        onPressed: _signup,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                TextButton(
                  onPressed: _isLoading ? null : () => context.go('/login'),
                  child: Text(
                    'Already have an account? Sign in',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.electricBlueLight),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _field(
    TextEditingController controller,
    String label,
    IconData icon, {
    String? hint,
    bool obscure = false,
    TextInputType keyboard = TextInputType.text,
  }) {
    return TextField(
      controller: controller,
      style: const TextStyle(color: AppColors.textPrimary),
      obscureText: obscure,
      keyboardType: keyboard,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        labelStyle: const TextStyle(color: AppColors.textTertiary),
        hintStyle: const TextStyle(color: AppColors.textTertiary, fontSize: 12),
        prefixIcon: Icon(icon, color: AppColors.textTertiary, size: 20),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
          borderSide: const BorderSide(color: AppColors.borderSubtle),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
          borderSide: const BorderSide(color: AppColors.electricBlue),
        ),
      ),
    );
  }

  Future<void> _signup() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await ref.read(authProvider.notifier).register(
            email: _emailController.text.trim(),
            password: _passwordController.text,
            username: _usernameController.text.trim(),
            displayName: _displayNameController.text.trim(),
          );
      if (mounted) context.go('/');
    } on DioException catch (e) {
      setState(() => _error = ref.read(apiClientProvider).apiErrorMessage(e, fallback: 'Signup failed'));
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _usernameController.dispose();
    _displayNameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
