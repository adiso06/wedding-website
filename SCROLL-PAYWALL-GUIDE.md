# Scroll Paywall Implementation Guide

## 🎯 What Is It?

A Guardian/New York Times-style paywall that **slides up from the bottom** of the screen after the user scrolls down the page. It's inviting, easy to dismiss, and encourages RSVPs without being aggressive.

## 📊 Visual Behavior

```
┌─────────────────────────────────┐
│  Website Content (scrolling)     │
│  User scrolls down...            │
│  [800px threshold reached]       │
│                                  │
│  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓              │
│                                  │
│  More content...                 │
└─────────────────────────────────┘
                ↓
                ↓ [Scroll paywall slides up]
                ↓
┌─────────────────────────────────┐
│  Website Content                 │
│                                  │
├═════════════════════════════════┤
│ ┌───────────────────────────┐ X │
│ │         💍 (pulsing)       │   │
│ │ Join Us for the Celebration│   │
│ │                            │   │
│ │ You're reading about our   │   │
│ │ special day — why not be   │   │
│ │ part of it? RSVP now!      │   │
│ │                            │   │
│ │  [RSVP to the Wedding]     │   │
│ │                            │   │
│ │ Free • Takes 2 minutes     │   │
│ └───────────────────────────┘   │
└─────────────────────────────────┘
        ↑
        Slides up from bottom
```

## ✨ Key Features

### Design Philosophy
- **Inviting, not blocking** - Warm messaging about joining the celebration
- **Easy to dismiss** - Clear X button in corner
- **Non-intrusive** - Appears at natural scroll point
- **Wedding-themed** - Uses 💍 icon and personal language
- **Professional** - Clean design matching Guardian/NYT style

### User Experience
1. User starts scrolling through wedding content
2. After 800px of scrolling → paywall smoothly slides up
3. User can either:
   - Click "RSVP to the Wedding" → Opens RSVP form
   - Click X button → Dismisses (stays dismissed)
   - Keep scrolling → Paywall stays visible

### Animation Details
- **Slide-up**: 0.5s cubic-bezier easing (smooth, natural)
- **Icon pulse**: Gentle 2s pulse to draw attention
- **Hover effects**: Button lifts on hover with shadow
- **Dismiss animation**: X button rotates 90° on hover

## 🎨 Design Specs

### Layout
```
┌────────────────────────────────────────────┐
│                                        [X] │  ← Dismiss button
│                    💍                       │  ← Pulsing icon (3rem)
│                                            │
│        Join Us for the Celebration         │  ← Title (1.75rem serif)
│                                            │
│   You're reading about our special day —   │  ← Message (1.0625rem)
│   why not be part of it? RSVP now to      │     Max-width: 600px
│   confirm your attendance...               │
│                                            │
│     ┌──────────────────────────────┐      │
│     │   RSVP to the Wedding        │      │  ← CTA button
│     └──────────────────────────────┘      │     (Black bg, uppercase)
│                                            │
│   Free • Takes 2 minutes • Unlock full     │  ← Small italic note
└────────────────────────────────────────────┘
```

### Colors
- Background: White → Light gray gradient
- Border: 3px solid black (top)
- Button: Black background, newsprint text
- Text: Black (#000) for title, Dark gray (#333) for body
- Close button: Gray (#999) → Black on hover

### Typography
- Title: Playfair Display (serif), 1.75rem, bold
- Message: Body font, 1.0625rem, regular
- Button: Headline font, 1.0625rem, bold, uppercase
- Note: 0.8125rem, italic

## 📏 Trigger Settings

```typescript
const SCROLL_THRESHOLD = 800; // Pixels scrolled before trigger
```

### Recommended Values
- **Current (Balanced)**: 800px - Appears after ~1 screen scroll
- **Early Bird**: 400-600px - Very aggressive, appears quickly
- **Patient**: 1200-1500px - Only shows to engaged readers
- **Content-Aware**: 1000px - After hero section typically

## 🔄 Behavior Rules

### When It Appears
✅ User scrolls past 800px threshold
✅ User hasn't RSVP'd yet
✅ User hasn't dismissed it in this session

### When It Doesn't Appear
❌ User already RSVP'd (localStorage check)
❌ User dismissed it (stored in ref, session-based)
❌ RSVP modal is currently open
❌ User hasn't scrolled enough

### Persistence
- **Dismissed state**: Lasts for current session only
- **RSVP state**: Permanent (localStorage)
- **On page refresh**: Resets if not RSVP'd, checks localStorage

## 🎭 Messaging Variants

### Current (Warm & Inviting)
```
💍
Join Us for the Celebration

You're reading about our special day — why not be part of it? 
RSVP now to confirm your attendance and get full access to all 
event details.

[RSVP to the Wedding]
```

### Alternative 1 (Urgency)
```
💍
Don't Miss the Celebration

You've been reading all about our wedding — now make it official! 
RSVP today to secure your spot and unlock exclusive content.

[Confirm Your Attendance]
```

### Alternative 2 (Benefit-Focused)
```
💍
Complete Your Wedding Experience

RSVP now to unlock:
• Full event schedule
• Travel & accommodation details  
• Photo galleries & stories
• Interactive timeline

[RSVP (It's Free!)]
```

### Alternative 3 (Playful)
```
🎉
Caught You Reading!

If you're this interested in our wedding, you should probably 
come! Hit RSVP to let us know you'll be there.

[Count Me In!]
```

## 📱 Mobile Optimization

### Responsive Breakpoints
- Desktop: Full width, centered content (max-width: 800px)
- Tablet: Same layout, slightly reduced padding
- Mobile (<768px): 
  - Full-width CTA button
  - Reduced icon size (2.5rem)
  - Smaller title (1.375rem)
  - Adjusted padding

### Touch-Friendly
- Close button: 32px × 32px (easy to tap)
- CTA button: 48px height minimum
- Adequate spacing between elements

## 🧪 Testing Tips

### Quick Test
```javascript
// In browser console
window.scrollTo({ top: 900, behavior: 'smooth' });
// Scroll paywall should appear
```

### Reset Between Tests
```javascript
// Clear RSVP status
localStorage.removeItem('hasRSVPd');
// Reload page
location.reload();
```

### Adjust Threshold for Testing
```typescript
// In App.tsx - make it appear instantly
const SCROLL_THRESHOLD = 100; // Very low threshold
```

## 🎯 Integration with Other Paywalls

### Three-Layer System
1. **Scroll Paywall** (800px scroll) - Most visible, most inviting
2. **Banner Nudge** (2 articles or 45s) - Secondary reminder
3. **Article Paywall** (in-article) - Final conversion point

### Why Multiple?
- Different users respond to different prompts
- Scroll = engagement-based (actively reading)
- Articles = consumption-based (high interest)
- Time = passive-based (browsing)

### Coordination
All three:
- Check localStorage for `hasRSVPd`
- Disappear after RSVP submission
- Don't show during RSVP modal
- Use consistent branding/messaging

## 🚀 Performance

- **Scroll listener**: Passive mode enabled (no scroll jank)
- **Animation**: GPU-accelerated (transform + opacity)
- **No reflows**: Uses transforms instead of position changes
- **Lazy mount**: Only renders when triggered

## 🎨 Customization Ideas

### Add Countdown
```tsx
<p>Join {guestCount} others who've already RSVP'd!</p>
```

### Add Social Proof
```tsx
<div className="recent-rsvps">
  Recent RSVPs: Sarah T., Michael R., Jennifer K.
</div>
```

### Add Urgency
```tsx
<p className="deadline">RSVP by February 15th to confirm your spot</p>
```

### Seasonal Variations
```tsx
// Spring theme
icon: "🌸"
// Summer theme  
icon: "☀️"
// Fall theme
icon: "🍂"
```

---

## 📝 Summary

You now have a **production-ready scroll paywall** that:
- ✅ Slides up smoothly from the bottom (like Guardian/NYT)
- ✅ Triggers after 800px of scrolling
- ✅ Features warm, inviting wedding-themed messaging
- ✅ Has a prominent RSVP call-to-action
- ✅ Is easy to dismiss with a clear X button
- ✅ Works perfectly on mobile devices
- ✅ Integrates with your existing paywall system
- ✅ Respects user choices (dismisses stay dismissed)
- ✅ Stops showing after RSVP submission

**The perfect balance of visibility and user experience!** 🎉


