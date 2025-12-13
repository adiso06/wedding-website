# The Daily Nuptial - NYT-Inspired Wedding Website

A wedding website designed to mimic the aesthetic and information density of the classic New York Times desktop homepage. Editorial/Journalistic rather than Romantic/Soft.

## Design Philosophy

This website transforms the traditional wedding website into a "newspaper" celebrating a couple's union:

- **Typography**: High-contrast pairing with heavy condensed serif headlines and clean sans-serif body text
- **Layout**: Strict 5-column CSS Grid system with 1px black borders
- **Palette**: Black (#000000), Off-White/Newsprint (#F7F7F5), and Deep Crimson accent (#8B0000)
- **Tone**: Journalistic and witty, treating the wedding as "breaking news"

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see your website.

### Build for Production

```bash
npm run build
```

## Customization Guide

### 1. Update Couple Information

**File**: `src/components/Masthead.tsx`
- Change "The Daily Nuptial" to your custom publication name
- Update weather location and wedding date
- Modify the countdown ticker

**File**: `src/components/Hero.tsx`
- Replace couple names: "Sarah Thompson and James Anderson"
- Update the main headline
- Customize the engagement story
- Add your own photo (replace the placeholder)

### 2. Customize Wedding Details

**File**: `src/components/ContentGrid.tsx`

Update the following sections:

#### Accommodations
- Hotel name and address
- Group rate code
- Booking deadline

#### Schedule
- Ceremony time and location
- Reception timeline
- Event details

#### Travel Information
- Airport recommendations
- Venue location
- Transportation details

#### Our Story
- How you met narrative
- Engagement story
- Key relationship dates

#### Registry
- Update registry links
- Customize charity options

### 3. Personalize the Tone

The website uses journalistic headlines like:
- "LONG-AWAITED MERGER FINALIZED"
- "Delegates to be Housed at..."
- "Attendance Mandatory"

Feel free to adjust the tone in each component to match your personality!

### 4. Add Your Photos

Replace the placeholder images:
- Hero section: Large engagement or couple photo
- Story section: Additional photos of your journey

### 5. RSVP Integration

**File**: `src/components/RSVPModal.tsx`

The current RSVP form logs to console. To make it functional:
- Integrate with a backend service (Google Forms, Airtable, custom API)
- Add email notification service
- Store responses in a database

Recommended services:
- **Google Forms** (easiest)
- **Airtable** (great for tracking)
- **Formspree** (simple form backend)
- **Custom backend** (most flexible)

### 6. Update Contact Information

**File**: `src/components/Footer.tsx`
- Change email address
- Update publication details
- Modify legal text

### 7. Color Customization

**File**: `src/styles/global.css`

Update CSS variables:
```css
:root {
  --color-black: #000000;
  --color-newsprint: #F7F7F5;
  --color-accent: #8B0000; /* Change this for different accent color */
}
```

Popular alternatives:
- Navy Blue: `#1a1a4d`
- Deep Green: `#1a4d2e`
- Burgundy: `#6B0F1A`

## Project Structure

```
wedding-website/
├── src/
│   ├── components/
│   │   ├── Masthead.tsx         # Header with "ears" and title
│   │   ├── Navigation.tsx       # Section navigation
│   │   ├── Hero.tsx            # Above-the-fold lead story
│   │   ├── BreakingNews.tsx    # Dress code banner
│   │   ├── ContentGrid.tsx     # Main content sections
│   │   ├── Footer.tsx          # Footer with subscribe
│   │   └── RSVPModal.tsx       # RSVP form modal
│   ├── styles/
│   │   ├── global.css          # Global styles & design system
│   │   └── App.css             # Grid system
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
├── index.html
├── package.json
└── README.md
```

## Typography

The website uses these font families:

- **Headlines**: PT Serif (heavy, condensed serif)
- **Body**: Arial / Franklin Gothic (clean sans-serif)
- **Captions**: Libre Baskerville (elegant serif)
- **Masthead**: UnifrakturMaguntia (blackletter/Old English)

All fonts are loaded from Google Fonts.

## Responsive Design

The website is fully responsive:
- **Desktop**: 5-column grid layout with borders
- **Mobile**: Single-column feed maintaining newspaper aesthetic

## Features

- ✅ NYT-style masthead with "ears" (weather/price)
- ✅ Dateline with countdown ticker
- ✅ Section navigation
- ✅ Editorial-style hero section
- ✅ Breaking news banner
- ✅ Grid-based content sections
- ✅ Schedule as timeline/ticker
- ✅ Registry as classified ads
- ✅ RSVP modal (subscription form)
- ✅ Fully responsive mobile design
- ✅ Black & white with accent color
- ✅ 1px borders for "ink on paper" feel

## Deployment

### Netlify (Recommended)

1. Push your code to GitHub
2. Connect your repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Framework preset: Vite
4. Deploy

### GitHub Pages

```bash
npm run build
# Deploy the 'dist' folder to GitHub Pages
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This is a personal wedding website template. Feel free to use and customize for your own wedding!

## Credits

Design inspired by The New York Times.
Built with React, TypeScript, and Vite.

---

**Made with ❤️ for your special day**
