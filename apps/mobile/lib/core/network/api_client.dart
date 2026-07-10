import 'dart:convert';

import 'package:dio/dio.dart';
import '../network/api_config.dart';
import '../auth/token_storage.dart';

class ApiClient {
  ApiClient({TokenStorage? tokenStorage})
      : _tokenStorage = tokenStorage ?? TokenStorage(),
        _dio = Dio(
          BaseOptions(
            baseUrl: ApiConfig.baseUrl,
            connectTimeout: const Duration(seconds: 30),
            receiveTimeout: const Duration(seconds: 30),
            headers: {'Content-Type': 'application/json'},
          ),
        ) {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _tokenStorage.getAccessToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            final refreshed = await _tryRefresh();
            if (refreshed) {
              final request = error.requestOptions;
              request.headers['Authorization'] =
                  'Bearer ${await _tokenStorage.getAccessToken()}';
              final response = await _dio.fetch(request);
              handler.resolve(response);
              return;
            }
            await _tokenStorage.clear();
          }
          handler.next(error);
        },
      ),
    );
  }

  final Dio _dio;
  final TokenStorage _tokenStorage;
  bool _refreshing = false;

  Dio get dio => _dio;

  Future<bool> _tryRefresh() async {
    if (_refreshing) return false;
    _refreshing = true;
    try {
      final refreshToken = await _tokenStorage.getRefreshToken();
      if (refreshToken == null) return false;

      final response = await Dio(BaseOptions(baseUrl: ApiConfig.baseUrl)).post(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );

      final body = response.data as Map<String, dynamic>;
      final data = body['data'] as Map<String, dynamic>;
      await _tokenStorage.saveTokens(
        accessToken: data['accessToken'] as String,
        refreshToken: data['refreshToken'] as String,
      );
      return true;
    } catch (_) {
      return false;
    } finally {
      _refreshing = false;
    }
  }

  Future<T> getData<T>(
    String path, {
    Map<String, dynamic>? query,
    T Function(dynamic json)? parser,
  }) async {
    final response = await _dio.get(path, queryParameters: query);
    return _unwrap(response.data, parser);
  }

  Future<T> postData<T>(
    String path, {
    Object? data,
    Map<String, String>? headers,
    T Function(dynamic json)? parser,
  }) async {
    final response = await _dio.post(path, data: data, options: Options(headers: headers));
    return _unwrap(response.data, parser);
  }

  Future<T> patchData<T>(
    String path, {
    Object? data,
    T Function(dynamic json)? parser,
  }) async {
    final response = await _dio.patch(path, data: data);
    return _unwrap(response.data, parser);
  }

  T _unwrap<T>(dynamic body, T Function(dynamic json)? parser) {
    if (body is Map<String, dynamic> && body.containsKey('data')) {
      final data = body['data'];
      if (parser != null) return parser(data);
      return data as T;
    }
    if (parser != null) return parser(body);
    return body as T;
  }

  String apiErrorMessage(DioException error, {String fallback = 'Request failed'}) {
    final data = error.response?.data;
    if (data is Map<String, dynamic>) {
      final err = data['error'];
      if (err is Map && err['message'] is String) return err['message'] as String;
    }
    return error.message ?? fallback;
  }
}

class AuthUser {
  AuthUser({
    required this.id,
    required this.username,
    required this.displayName,
    required this.role,
    required this.vipLevel,
    this.avatarUrl,
    this.isGuest = false,
  });

  final String id;
  final String username;
  final String displayName;
  final String role;
  final int vipLevel;
  final String? avatarUrl;
  final bool isGuest;

  factory AuthUser.fromJson(Map<String, dynamic> json) => AuthUser(
        id: json['id'] as String,
        username: json['username'] as String,
        displayName: json['displayName'] as String,
        role: json['role'] as String? ?? 'user',
        vipLevel: (json['vipLevel'] as num?)?.toInt() ?? 0,
        avatarUrl: json['avatarUrl'] as String?,
        isGuest: json['isGuest'] as bool? ?? false,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'username': username,
        'displayName': displayName,
        'role': role,
        'vipLevel': vipLevel,
        'avatarUrl': avatarUrl,
        'isGuest': isGuest,
      };
}

class AuthRepository {
  AuthRepository(this._client, this._storage);

  final ApiClient _client;
  final TokenStorage _storage;

  Future<AuthUser> login(String email, String password) async {
    final data = await _client.postData<Map<String, dynamic>>(
      '/auth/login',
      data: {
        'email': email,
        'password': password,
        'platform': 'android',
        'deviceName': 'Earn4U Mobile',
      },
    );

    final user = AuthUser.fromJson(data['user'] as Map<String, dynamic>);
    await _storage.saveTokens(
      accessToken: data['accessToken'] as String,
      refreshToken: data['refreshToken'] as String,
      userJson: jsonEncode(user.toJson()),
    );
    return user;
  }

  Future<AuthUser> register({
    required String email,
    required String password,
    required String username,
    required String displayName,
  }) async {
    final data = await _client.postData<Map<String, dynamic>>(
      '/auth/register',
      data: {
        'email': email,
        'password': password,
        'username': username,
        'displayName': displayName,
      },
    );

    final user = AuthUser.fromJson(data['user'] as Map<String, dynamic>);
    await _storage.saveTokens(
      accessToken: data['accessToken'] as String,
      refreshToken: data['refreshToken'] as String,
      userJson: jsonEncode(user.toJson()),
    );
    return user;
  }

  Future<AuthUser> guestLogin() async {
    final fingerprint = DateTime.now().millisecondsSinceEpoch.toString();
    final data = await _client.postData<Map<String, dynamic>>(
      '/auth/login/guest',
      data: {
        'deviceFingerprint': fingerprint,
        'platform': 'android',
        'deviceName': 'Earn4U Mobile',
      },
    );

    final user = AuthUser.fromJson(data['user'] as Map<String, dynamic>);
    await _storage.saveTokens(
      accessToken: data['accessToken'] as String,
      refreshToken: data['refreshToken'] as String,
      userJson: jsonEncode(user.toJson()),
    );
    return user;
  }

  Future<AuthUser?> loadSession() async {
    final token = await _storage.getAccessToken();
    final userJson = await _storage.getUserJson();
    if (token == null || userJson == null) return null;
    return AuthUser.fromJson(jsonDecode(userJson) as Map<String, dynamic>);
  }

  Future<void> logout() async {
    try {
      await _client.postData('/auth/logout');
    } catch (_) {}
    await _storage.clear();
  }
}
