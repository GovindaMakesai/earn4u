import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/discover/presentation/discover_screen.dart';
import '../../features/gifts/presentation/gifts_showcase_screen.dart';
import '../../features/home/presentation/home_screen.dart';
import '../../features/live/presentation/live_hub_screen.dart';
import '../../features/live/presentation/live_stream_screen.dart';
import '../../features/messages/presentation/messages_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';
import '../../features/shell/main_shell.dart';
import '../../features/voice/presentation/voice_room_screen.dart';
import '../../features/wallet/presentation/wallet_screen.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    ShellRoute(
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(path: '/', builder: (context, state) => const HomeScreen()),
        GoRoute(path: '/discover', builder: (context, state) => const DiscoverScreen()),
        GoRoute(path: '/messages', builder: (context, state) => const MessagesScreen()),
        GoRoute(path: '/profile', builder: (context, state) => const ProfileScreen()),
      ],
    ),
    // Full-screen experiences (outside shell)
    GoRoute(
      path: '/live-hub',
      builder: (context, state) => const LiveHubScreen(),
    ),
    GoRoute(
      path: '/live/:id',
      builder: (context, state) => LiveStreamScreen(streamId: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/voice/:id',
      builder: (context, state) => VoiceRoomScreen(roomId: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/wallet',
      builder: (context, state) => const WalletScreen(),
    ),
    GoRoute(
      path: '/gifts',
      builder: (context, state) => const GiftsShowcaseScreen(),
    ),
  ],
);
