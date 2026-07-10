import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../network/api_client.dart';
import '../auth/auth_provider.dart';

class AppRepository {
  AppRepository(this._client);

  final ApiClient _client;

  Future<List<Map<String, dynamic>>> getStreams() async {
    final data = await _client.getData<List<dynamic>>('/streams');
    return data.cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getRooms() async {
    final data = await _client.getData<List<dynamic>>('/rooms');
    return data.cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> getWallet() async {
    return _client.getData<Map<String, dynamic>>('/wallet');
  }

  Future<List<Map<String, dynamic>>> getTransactions({int page = 1}) async {
    final data = await _client.getData<Map<String, dynamic>>(
      '/wallet/transactions',
      query: {'page': page, 'limit': 20},
    );
    return (data['data'] as List<dynamic>).cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getCoinPackages() async {
    final data = await _client.getData<List<dynamic>>(
      '/wallet/coin-packages',
      query: {'platform': 'android'},
    );
    return data.cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> getProfile() async {
    return _client.getData<Map<String, dynamic>>('/users/me');
  }

  Future<List<Map<String, dynamic>>> getGifts() async {
    final data = await _client.getData<List<dynamic>>('/gifts');
    return data.cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getConversations() async {
    final data = await _client.getData<List<dynamic>>('/conversations');
    return data.cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getWithdrawals() async {
    final data = await _client.getData<List<dynamic>>('/withdrawals');
    return data.cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> createWithdrawal({
    required int amountDiamonds,
    required String method,
  }) async {
    return _client.postData<Map<String, dynamic>>(
      '/withdrawals',
      data: {'amountDiamonds': amountDiamonds, 'method': method},
    );
  }

  Future<List<Map<String, dynamic>>> getVipTiers() async {
    final data = await _client.getData<List<dynamic>>('/vip/tiers');
    return data.cast<Map<String, dynamic>>();
  }

  Future<List<Map<String, dynamic>>> getPkLeaderboard() async {
    final data = await _client.getData<List<dynamic>>('/pk/leaderboard');
    return data.cast<Map<String, dynamic>>();
  }
}

final appRepositoryProvider = Provider<AppRepository>((ref) {
  return AppRepository(ref.watch(apiClientProvider));
});

final streamsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  ref.watch(authProvider);
  return ref.watch(appRepositoryProvider).getStreams();
});

final roomsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  ref.watch(authProvider);
  return ref.watch(appRepositoryProvider).getRooms();
});

final walletProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  ref.watch(authProvider);
  return ref.watch(appRepositoryProvider).getWallet();
});

final profileProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  ref.watch(authProvider);
  return ref.watch(appRepositoryProvider).getProfile();
});

final giftsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  ref.watch(authProvider);
  return ref.watch(appRepositoryProvider).getGifts();
});

final conversationsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  ref.watch(authProvider);
  return ref.watch(appRepositoryProvider).getConversations();
});

final coinPackagesProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  ref.watch(authProvider);
  return ref.watch(appRepositoryProvider).getCoinPackages();
});
