# Earn4U — Design System

**Version:** 1.0.0  
**Last Updated:** June 2026

---

## 1. Design Philosophy

Earn4U embodies **luxury digital entertainment** — dark, elegant, premium. Every pixel communicates quality and exclusivity. The design language draws from high-end fashion apps, premium streaming platforms, and luxury automotive interfaces.

**Principles:**
- Dark mode first, always
- Glassmorphism for depth and layering
- Subtle gradients, never garish
- 60 FPS animations with purposeful motion
- Generous whitespace and breathing room
- Typography that commands attention

---

## 2. Color Palette

### 2.1 Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-900` | `#0A0A0F` | App background |
| `primary-800` | `#12121A` | Card backgrounds |
| `primary-700` | `#1A1A25` | Elevated surfaces |
| `primary-600` | `#252532` | Borders, dividers |
| `primary-500` | `#35354A` | Disabled states |

### 2.2 Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-gold` | `#D4A853` | VIP, premium, wealth |
| `accent-gold-light` | `#F0D78C` | Gold highlights |
| `accent-purple` | `#8B5CF6` | Primary CTA, links |
| `accent-purple-light` | `#A78BFA` | Hover states |
| `accent-rose` | `#F43F5E` | Live indicators, hearts |
| `accent-cyan` | `#22D3EE` | Online status, info |
| `accent-emerald` | `#10B981` | Success, earnings |

### 2.3 Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#10B981` | Confirmations |
| `warning` | `#F59E0B` | Warnings |
| `error` | `#EF4444` | Errors, destructive |
| `info` | `#3B82F6` | Informational |

### 2.4 Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#FFFFFF` | Headings, primary text |
| `text-secondary` | `#A1A1B5` | Body text, descriptions |
| `text-tertiary` | `#6B6B80` | Captions, timestamps |
| `text-disabled` | `#4A4A5E` | Disabled text |
| `text-gold` | `#D4A853` | VIP text, wealth indicators |

### 2.5 Gradient Definitions

```css
/* Premium gold gradient */
--gradient-gold: linear-gradient(135deg, #D4A853 0%, #F0D78C 50%, #D4A853 100%);

/* Purple accent gradient */
--gradient-purple: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);

/* Dark surface gradient */
--gradient-surface: linear-gradient(180deg, #1A1A25 0%, #12121A 100%);

/* Live stream gradient overlay */
--gradient-live: linear-gradient(0deg, rgba(10,10,15,0.8) 0%, transparent 50%);

/* VIP frame gradient */
--gradient-vip: linear-gradient(135deg, #D4A853, #8B5CF6, #D4A853);
```

---

## 3. Typography

### 3.1 Font Families

| Token | Family | Usage |
|-------|--------|-------|
| `font-display` | **Outfit** (Google Fonts) | Headings, display text |
| `font-body` | **Inter** (Google Fonts) | Body text, UI elements |
| `font-mono` | **JetBrains Mono** | Numbers, codes, stats |

### 3.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `display-xl` | 32sp | 700 | 1.2 | Hero headings |
| `display-lg` | 28sp | 700 | 1.2 | Section headings |
| `heading-lg` | 24sp | 600 | 1.3 | Page titles |
| `heading-md` | 20sp | 600 | 1.3 | Card titles |
| `heading-sm` | 18sp | 600 | 1.4 | Subsection titles |
| `body-lg` | 16sp | 400 | 1.5 | Primary body |
| `body-md` | 14sp | 400 | 1.5 | Secondary body |
| `body-sm` | 12sp | 400 | 1.4 | Captions |
| `label-lg` | 14sp | 500 | 1.0 | Button labels |
| `label-sm` | 11sp | 500 | 1.0 | Badges, tags |

---

## 4. Spacing System

Base unit: **4dp**

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4dp | Tight spacing |
| `space-2` | 8dp | Icon gaps |
| `space-3` | 12dp | Compact padding |
| `space-4` | 16dp | Standard padding |
| `space-5` | 20dp | Medium gaps |
| `space-6` | 24dp | Section padding |
| `space-8` | 32dp | Large gaps |
| `space-10` | 40dp | Section margins |
| `space-12` | 48dp | Hero spacing |
| `space-16` | 64dp | Page margins |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 8dp | Buttons, inputs |
| `radius-md` | 12dp | Cards, modals |
| `radius-lg` | 16dp | Large cards |
| `radius-xl` | 24dp | Bottom sheets |
| `radius-full` | 999dp | Avatars, pills |

---

## 6. Shadows & Elevation

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 2px 8px rgba(0,0,0,0.3)` | Subtle lift |
| `shadow-md` | `0 4px 16px rgba(0,0,0,0.4)` | Cards |
| `shadow-lg` | `0 8px 32px rgba(0,0,0,0.5)` | Modals, overlays |
| `shadow-glow-gold` | `0 0 20px rgba(212,168,83,0.3)` | VIP elements |
| `shadow-glow-purple` | `0 0 20px rgba(139,92,246,0.3)` | Active elements |

---

## 7. Glassmorphism

```css
.glass-surface {
  background: rgba(26, 26, 37, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.glass-card {
  background: rgba(18, 18, 26, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

---

## 8. Component Library

### 8.1 Buttons

| Variant | Style |
|---------|-------|
| Primary | Purple gradient bg, white text, shadow-glow-purple |
| Secondary | Glass surface, white text, border |
| Gold | Gold gradient bg, dark text |
| Ghost | Transparent, text-secondary, no border |
| Destructive | Error color bg, white text |
| Icon | 44x44dp circle, glass surface |

### 8.2 Cards

- Glass card with subtle border
- 16dp border radius
- 16dp internal padding
- Optional gold/purple accent border for premium items

### 8.3 Avatar

| Size | Dimensions | Usage |
|------|-----------|-------|
| xs | 24dp | Inline mentions |
| sm | 32dp | Comment lists |
| md | 48dp | Profile cards |
| lg | 64dp | Profile headers |
| xl | 96dp | Profile page |
| xxl | 120dp | Full profile view |

VIP frames overlay avatars based on VIP level.

### 8.4 Input Fields

- Glass surface background
- 12dp border radius
- 16dp horizontal padding
- Purple border on focus
- Floating label animation

### 8.5 Bottom Navigation

- Glass surface bar
- 5 tabs: Home, Discover, Go Live (center FAB), Messages, Profile
- Center FAB: Purple gradient circle with glow
- Active tab: Purple accent icon + label

### 8.6 Gift Animation Overlay

- Full-screen overlay
- Layered effects: particle system + 3D model + sound
- Sender name + gift name at bottom
- Combo counter with scale animation
- Auto-dismiss after animation completes

### 8.7 VIP Badge

- Gold gradient pill shape
- VIP level number
- Glow effect proportional to level
- Levels 15+: animated shimmer

### 8.8 Live Indicator

- Rose/red pulsing dot
- "LIVE" text in caps
- Subtle glow animation

---

## 9. Icon System

- **Library:** Phosphor Icons (Flutter: `phosphor_flutter`)
- **Style:** Regular weight default, Fill for active states
- **Size:** 20dp (inline), 24dp (navigation), 28dp (actions)
- **Color:** Inherits from text color tokens

---

## 10. Animation Guidelines

| Animation | Duration | Curve | Usage |
|-----------|----------|-------|-------|
| Page transition | 300ms | easeOutCubic | Screen navigation |
| Modal appear | 250ms | easeOutBack | Bottom sheets, dialogs |
| Button press | 100ms | easeInOut | Scale 0.95 on press |
| Gift send | 2000-5000ms | custom | Full gift animation |
| VIP entry | 1500ms | easeOutCubic | Room entry effect |
| Skeleton shimmer | 1500ms | linear | Loading states |
| Pull to refresh | 300ms | easeOutCubic | Refresh indicator |
| Tab switch | 200ms | easeInOut | Bottom nav |

**Rules:**
- Never exceed 300ms for UI transitions
- Gift/VIP animations are the exception (up to 5s)
- Always use `AnimatedBuilder` or `AnimationController`
- Prefer implicit animations for simple state changes

---

## 11. Accessibility

- Minimum touch target: 44x44dp
- Color contrast ratio: ≥ 4.5:1 (WCAG AA)
- All images have semantic labels
- Screen reader support for all interactive elements
- Reduced motion option respects system settings
- Font scaling support up to 200%

---

## 12. Screen Templates

### Home Feed
- Full-bleed stream/room cards
- Glass category filter chips at top
- Infinite scroll with skeleton loading
- Pull-to-refresh

### Live Stream View
- Full-screen video with gradient overlay
- Floating comment stream (right side)
- Bottom action bar: comment, gift, share, more
- Top bar: host info, viewer count, close

### Voice Room
- Circular seat layout
- Host seat at top center (larger)
- Speaker seats in arc below
- Audience count at bottom
- Floating gift tray

### Profile
- Cover image with gradient overlay
- Centered avatar with VIP frame
- Stats row: followers, following, level badges
- Tab bar: About, Gallery, Streams, Gifts

### Wallet
- Balance cards with glass effect
- Gold accent for coins, cyan for diamonds
- Transaction list with category icons
- Purchase CTA with gold gradient button

---

## 13. Flutter Implementation

Design tokens are implemented in:
- `apps/mobile/lib/core/theme/app_colors.dart`
- `apps/mobile/lib/core/theme/app_typography.dart`
- `apps/mobile/lib/core/theme/app_spacing.dart`
- `apps/mobile/lib/core/theme/app_theme.dart`
- `apps/mobile/lib/core/theme/app_animations.dart`

Component library in:
- `apps/mobile/lib/shared/widgets/`

---

## 14. Related Documents

- [PRD](PRD.md)
- [Feature Roadmap](feature-roadmap.md)
