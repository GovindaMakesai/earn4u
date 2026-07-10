import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../network/api_client.dart';
import 'token_storage.dart';

final tokenStorageProvider = Provider<TokenStorage>((ref) => TokenStorage());

final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(tokenStorage: ref.watch(tokenStorageProvider));
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(apiClientProvider), ref.watch(tokenStorageProvider));
});

class AuthState {
  const AuthState({this.user, this.loading = false});

  final AuthUser? user;
  final bool loading;

  bool get isAuthenticated => user != null;

  AuthState copyWith({AuthUser? user, bool? loading}) => AuthState(
        user: user ?? this.user,
        loading: loading ?? this.loading,
      );
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._repo) : super(const AuthState(loading: true)) {
    _bootstrap();
  }

  final AuthRepository _repo;

  Future<void> _bootstrap() async {
    final user = await _repo.loadSession();
    state = AuthState(user: user, loading: false);
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(loading: true);
    final user = await _repo.login(email, password);
    state = AuthState(user: user, loading: false);
  }

  Future<void> guestLogin() async {
    state = state.copyWith(loading: true);
    final user = await _repo.guestLogin();
    state = AuthState(user: user, loading: false);
  }

  Future<void> register({
    required String email,
    required String password,
    required String username,
    required String displayName,
  }) async {
    state = state.copyWith(loading: true);
    final user = await _repo.register(
      email: email,
      password: password,
      username: username,
      displayName: displayName,
    );
    state = AuthState(user: user, loading: false);
  }

  Future<void> logout() async {
    await _repo.logout();
    state = const AuthState(user: null, loading: false);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.watch(authRepositoryProvider));
});
