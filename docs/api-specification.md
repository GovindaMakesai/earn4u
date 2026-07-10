# Earn4U — API Specification

**Version:** 1.0.0  
**Base URL:** `https://api.earn4u.com/api/v1`  
**WebSocket:** `wss://ws.earn4u.com`  
**Last Updated:** June 2026

---

## 1. Conventions

### 1.1 Authentication

All authenticated endpoints require:
```
Authorization: Bearer <access_token>
```

### 1.2 Response Format

```json
{
  "success": true,
  "data": { },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

### 1.3 Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### 1.4 Standard Error Codes

| HTTP | Code | Description |
|------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid request body/params |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Duplicate or state conflict |
| 422 | INSUFFICIENT_BALANCE | Not enough coins/diamonds |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

### 1.5 Pagination

Query params: `?page=1&limit=20&sort=created_at&order=desc`

### 1.6 Idempotency

Financial endpoints require header: `Idempotency-Key: <uuid-v4>`

---

## 2. Authentication API

### POST `/auth/register`
Register with email and password.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "username": "cooluser",
  "displayName": "Cool User"
}
```

**Response:** `201` — `{ user, accessToken, refreshToken }`

### POST `/auth/login`
Login with email/password.

**Body:** `{ "email", "password", "deviceFingerprint", "deviceName", "platform" }`  
**Response:** `200` — `{ user, accessToken, refreshToken }`

### POST `/auth/login/phone`
Request OTP for phone login.

**Body:** `{ "phone": "+1234567890" }`  
**Response:** `200` — `{ "otpSent": true, "expiresIn": 300 }`

### POST `/auth/login/phone/verify`
Verify phone OTP.

**Body:** `{ "phone", "otp", "deviceFingerprint", "deviceName", "platform" }`  
**Response:** `200` — `{ user, accessToken, refreshToken }`

### POST `/auth/login/google`
Google OAuth login.

**Body:** `{ "idToken", "deviceFingerprint", "deviceName", "platform" }`  
**Response:** `200` — `{ user, accessToken, refreshToken }`

### POST `/auth/login/apple`
Apple Sign-In.

**Body:** `{ "identityToken", "authorizationCode", "deviceFingerprint", "deviceName", "platform" }`  
**Response:** `200` — `{ user, accessToken, refreshToken }`

### POST `/auth/login/guest`
Guest login.

**Body:** `{ "deviceFingerprint", "deviceName", "platform" }`  
**Response:** `200` — `{ user, accessToken, refreshToken }`

### POST `/auth/refresh`
Refresh access token.

**Body:** `{ "refreshToken" }`  
**Response:** `200` — `{ accessToken, refreshToken }`

### POST `/auth/logout`
Revoke current session.

**Response:** `200` — `{ "loggedOut": true }`

### POST `/auth/2fa/enable`
Enable two-factor authentication.

**Response:** `200` — `{ "secret", "qrCodeUrl" }`

### POST `/auth/2fa/verify`
Verify 2FA code.

**Body:** `{ "code" }`  
**Response:** `200` — `{ "enabled": true }`

### GET `/auth/sessions`
List active sessions.

**Response:** `200` — `{ sessions: [...] }`

### DELETE `/auth/sessions/:sessionId`
Revoke a specific session.

---

## 3. Users API

### GET `/users/me`
Get current user profile with wallet summary.

**Response:** `200` — Full profile object

### PATCH `/users/me`
Update profile.

**Body:** `{ "displayName", "bio", "avatarUrl", "coverUrl", "language", "gender" }`

### GET `/users/:username`
Get public profile by username.

### GET `/users/:userId/followers`
Paginated follower list.

### GET `/users/:userId/following`
Paginated following list.

### POST `/users/:userId/follow`
Follow a user.

### DELETE `/users/:userId/follow`
Unfollow a user.

### GET `/users/:userId/achievements`
User achievements list.

### POST `/users/:userId/report`
Report a user.

**Body:** `{ "reason", "description", "contextType", "contextId" }`

### POST `/users/:userId/block`
Block a user.

---

## 4. Wallet & Economy API

### GET `/wallet`
Get wallet balances.

**Response:**
```json
{
  "coins": 15000,
  "diamonds": 2500,
  "rewardPoints": 350,
  "frozenCoins": 0,
  "frozenDiamonds": 0
}
```

### GET `/wallet/transactions`
Paginated transaction history.

**Query:** `?currency=coins&category=gift_sent&from=2026-01-01&to=2026-06-01`

### GET `/wallet/coin-packages`
Available coin packages for current platform.

### POST `/wallet/purchase`
Purchase coins.

**Body:** `{ "packageId", "paymentMethod", "receipt" }`  
**Headers:** `Idempotency-Key`  
**Response:** `200` — `{ transaction, newBalance }`

---

## 5. Gifts API

### GET `/gifts`
Gift catalog.

**Query:** `?category=premium&vipLevel=5`

### POST `/gifts/send`
Send a gift.

**Body:**
```json
{
  "giftId": "uuid",
  "receiverId": "uuid",
  "contextType": "stream",
  "contextId": "uuid",
  "quantity": 1
}
```
**Headers:** `Idempotency-Key`  
**Response:** `200` — `{ event, animation, comboCount, newBalance }`

### GET `/gifts/leaderboard`
Gift leaderboard for a context.

**Query:** `?contextType=stream&contextId=uuid&period=daily`

---

## 6. VIP API

### GET `/vip/tiers`
All VIP tier definitions and benefits.

### GET `/vip/me`
Current user's VIP status.

### POST `/vip/subscribe`
Subscribe to VIP.

**Body:** `{ "tierLevel", "paymentMethod", "receipt" }`

### POST `/vip/cancel`
Cancel VIP auto-renewal.

---

## 7. Voice Rooms API

### POST `/rooms`
Create a voice room.

**Body:**
```json
{
  "title": "Chill Vibes",
  "type": "public",
  "password": null,
  "maxSeats": 8,
  "category": "music",
  "tags": ["chill", "music"]
}
```

### GET `/rooms`
Discover rooms.

**Query:** `?category=music&status=active&sort=listener_count`

### GET `/rooms/:roomId`
Room details with current seats.

### PATCH `/rooms/:roomId`
Update room (host only).

### POST `/rooms/:roomId/join`
Join a room. Returns WebRTC token.

**Body:** `{ "password" }` (if password-protected)

### POST `/rooms/:roomId/leave`
Leave a room.

### POST `/rooms/:roomId/seats/:seatNumber/claim`
Claim a speaker seat.

### POST `/rooms/:roomId/seats/:seatNumber/mute`
Mute a seat (host/co-host).

### POST `/rooms/:roomId/kick/:userId`
Kick user from room.

### DELETE `/rooms/:roomId`
Close room (host only).

---

## 8. Live Streams API

### POST `/streams`
Start a livestream.

**Body:** `{ "title", "type": "video", "category", "tags" }`  
**Response:** `{ stream, webrtcToken }`

### GET `/streams`
Discover live streams.

**Query:** `?category=gaming&status=live`

### GET `/streams/:streamId`
Stream details.

### POST `/streams/:streamId/join`
Join as viewer. Returns WebRTC token.

### POST `/streams/:streamId/end`
End stream (host only).

### POST `/streams/:streamId/guest-request`
Request to join as guest.

### POST `/streams/:streamId/guest-approve/:userId`
Approve guest request (host only).

### GET `/streams/:streamId/replay`
Get replay URL (if available).

---

## 9. PK Battles API

### POST `/pk/invite`
Invite to PK battle.

**Body:** `{ "opponentId", "type": "solo_1v1", "durationSeconds": 300 }`

### POST `/pk/:battleId/accept`
Accept PK invitation.

### POST `/pk/:battleId/decline`
Decline PK invitation.

### GET `/pk/:battleId`
Battle status and scores.

### GET `/pk/leaderboard`
PK rankings.

**Query:** `?period=weekly&type=solo_1v1`

---

## 10. Messaging API

### GET `/conversations`
List user's conversations.

### POST `/conversations`
Create conversation.

**Body:** `{ "type": "direct", "participantIds": ["uuid"] }`  
**Body (group):** `{ "type": "group", "name": "Squad", "participantIds": ["uuid1", "uuid2"] }`

### GET `/conversations/:conversationId/messages`
Paginated messages.

**Query:** `?before=<messageId>&limit=50`

### POST `/conversations/:conversationId/messages`
Send a message.

**Body:** `{ "type": "text", "content": "Hello!" }`  
**Body (media):** `{ "type": "image", "mediaUrl": "https://..." }`

### POST `/conversations/:conversationId/messages/:messageId/react`
React to a message.

**Body:** `{ "emoji": "❤️" }`

### GET `/conversations/search`
Search messages.

**Query:** `?q=hello&conversationId=uuid`

---

## 11. Withdrawals API

### POST `/withdrawals`
Request withdrawal.

**Body:**
```json
{
  "amountDiamonds": 10000,
  "method": "bank_transfer",
  "paymentDetails": { "accountNumber": "...", "bankName": "..." }
}
```

### GET `/withdrawals`
Withdrawal history.

### GET `/withdrawals/:withdrawalId`
Withdrawal status.

### POST `/withdrawals/kyc`
Submit KYC documents.

**Body:** `{ "documentType", "documentUrl", "selfieUrl" }`

---

## 12. Admin API

All admin endpoints require elevated RBAC roles.

### GET `/admin/users`
Search and list users. **Roles:** admin+

### PATCH `/admin/users/:userId/status`
Suspend/ban/activate user. **Roles:** admin+

### GET `/admin/withdrawals/pending`
Pending withdrawal queue. **Roles:** admin+

### POST `/admin/withdrawals/:id/approve`
Approve withdrawal. **Roles:** admin+

### POST `/admin/withdrawals/:id/reject`
Reject withdrawal. **Roles:** admin+

### GET `/admin/dashboard/revenue`
Revenue dashboard data. **Roles:** admin+

### GET `/admin/dashboard/users`
User analytics. **Roles:** admin+

### GET `/admin/reports`
Moderation report queue. **Roles:** moderator+

### POST `/admin/gifts`
Create/update gift in catalog. **Roles:** admin+

### GET `/admin/audit-logs`
Audit log search. **Roles:** super_admin+

---

## 13. WebSocket Events

### Namespace: `/rooms`

| Event | Direction | Payload |
|-------|-----------|---------|
| `room:join` | Client→Server | `{ roomId }` |
| `room:joined` | Server→Client | `{ room, seats, listeners }` |
| `room:user-joined` | Server→Room | `{ user, seat }` |
| `room:user-left` | Server→Room | `{ userId }` |
| `room:seat-update` | Server→Room | `{ seat }` |
| `room:gift` | Server→Room | `{ giftEvent, animation }` |
| `room:reaction` | Client→Server→Room | `{ emoji }` |
| `room:announcement` | Server→Room | `{ text }` |

### Namespace: `/streams`

| Event | Direction | Payload |
|-------|-----------|---------|
| `stream:join` | Client→Server | `{ streamId }` |
| `stream:comment` | Client→Server→Stream | `{ text }` |
| `stream:gift` | Server→Stream | `{ giftEvent, animation }` |
| `stream:viewer-count` | Server→Stream | `{ count }` |
| `stream:reaction` | Client→Server→Stream | `{ emoji }` |

### Namespace: `/pk`

| Event | Direction | Payload |
|-------|-----------|---------|
| `pk:score-update` | Server→Battle | `{ sideA, sideB, leader }` |
| `pk:ended` | Server→Battle | `{ winner, scores, rewards }` |

### Namespace: `/chat`

| Event | Direction | Payload |
|-------|-----------|---------|
| `chat:message` | Server→Conversation | `{ message }` |
| `chat:typing` | Client→Server→Conversation | `{ userId }` |
| `chat:read` | Client→Server→Conversation | `{ messageId }` |

---

## 14. Rate Limits

| Endpoint Group | Limit |
|---------------|-------|
| Auth (login/register) | 10/min per IP |
| Auth (OTP) | 3/min per phone |
| API (general) | 100/min per user |
| Gift send | 30/min per user |
| Message send | 60/min per user |
| WebSocket events | 120/min per connection |

---

## 15. Related Documents

- [Technical Architecture](technical-architecture.md)
- [Database Architecture](database-architecture.md)
- [Security Architecture](security-architecture.md)
