/// Curated presentation content for UI development.
/// Replaced with API data when backend integration resumes.
class DemoContent {
  static const creators = [
    ('Luna Star', 'Music', 4820, true, 12),
    ('KingVibe', 'Gaming', 12400, true, 8),
    ('Aria Moon', 'Voice', 2100, false, 15),
    ('DJ Nexus', 'PK Battle', 8900, true, 5),
    ('Crystal', 'Chat', 3400, true, 20),
    ('Phoenix', 'Gaming', 6700, true, 3),
    ('Velvet', 'Music', 5200, false, 11),
    ('Storm', 'PK Battle', 15600, true, 7),
  ];

  static const voiceRooms = [
    ('Midnight Lounge', 24, 8),
    ('Chill Vibes Only', 156, 12),
    ('Music & Talk', 89, 6),
    ('PK Arena', 342, 10),
  ];

  static const trendingTags = ['All', 'Live', 'Voice', 'Gaming', 'Music', 'PK', 'New'];

  static const gifts = [
    ('Rose', 10, 'standard'),
    ('Sports Car', 5000, 'premium'),
    ('Private Jet', 50000, 'premium'),
    ('Dragon', 200000, 'event'),
    ('Yacht', 100000, 'premium'),
    ('Rocket', 500000, 'event'),
  ];

  static const coinPackages = [
    ('Starter', 100, 0, 0.99),
    ('Popular', 1200, 200, 9.99),
    ('Premium', 3000, 600, 24.99),
    ('Elite', 7000, 1500, 49.99),
  ];

  static const messages = [
    ('Luna Star', 'Hey! Join my voice room tonight 🎤', '2m', true),
    ('KingVibe', 'Thanks for the gift!', '15m', false),
    ('Aria Moon', 'PK battle at 8pm?', '1h', true),
  ];
}

enum ContentType { live, voice, pk }

class LiveCardData {
  final String name;
  final String category;
  final int viewers;
  final bool isLive;
  final int vipLevel;
  final ContentType type;
  final int gradientIndex;

  const LiveCardData({
    required this.name,
    required this.category,
    required this.viewers,
    required this.isLive,
    required this.vipLevel,
    required this.type,
    required this.gradientIndex,
  });

  factory LiveCardData.fromDemo(int index) {
    final c = DemoContent.creators[index % DemoContent.creators.length];
    return LiveCardData(
      name: c.$1,
      category: c.$2,
      viewers: c.$3,
      isLive: c.$4,
      vipLevel: c.$5,
      type: index.isEven ? ContentType.live : ContentType.voice,
      gradientIndex: index,
    );
  }
}
