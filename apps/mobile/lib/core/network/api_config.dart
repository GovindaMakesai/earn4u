class ApiConfig {
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://earn4u-api.onrender.com/api/v1',
  );
}
