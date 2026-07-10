import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  TokenStorage({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  static const _accessKey = 'earn4u_access_token';
  static const _refreshKey = 'earn4u_refresh_token';
  static const _userKey = 'earn4u_user_json';

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
    String? userJson,
  }) async {
    await _storage.write(key: _accessKey, value: accessToken);
    await _storage.write(key: _refreshKey, value: refreshToken);
    if (userJson != null) {
      await _storage.write(key: _userKey, value: userJson);
    }
  }

  Future<String?> getAccessToken() => _storage.read(key: _accessKey);

  Future<String?> getRefreshToken() => _storage.read(key: _refreshKey);

  Future<String?> getUserJson() => _storage.read(key: _userKey);

  Future<void> clear() async {
    await _storage.delete(key: _accessKey);
    await _storage.delete(key: _refreshKey);
    await _storage.delete(key: _userKey);
  }
}
