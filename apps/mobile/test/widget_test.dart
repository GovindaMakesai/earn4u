import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:earn4u_mobile/main.dart';

void main() {
  testWidgets('App loads home screen', (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: Earn4UApp()));
    await tester.pumpAndSettle();
    expect(find.text('Earn4U'), findsOneWidget);
  });
}
