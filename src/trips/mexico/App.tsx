import { useState, useRef, useEffect } from 'react';
import data from './data.json';

type Event = {
  id: string;
  time: string;
  title: string;
  kind: string;
  neighborhood?: string;
  address?: string;
  mapUrl?: string;
  placeKey?: string;
  description: string;
  tips?: string[];
  editorNote?: string;
  travelNote?: string;
  backupPlan?: string;
  reservationStatus?: string;
  confirmationCode?: string;
  defaultExpanded?: boolean;
  transportHint?: 'uber' | 'long-walk';
};

type Day = {
  id: string;
  date: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  summary: string;
  imageUrl: string;
  transportSummary: string;
  events: Event[];
};

type PlaceGuide = {
  name: string;
  summary: string;
  famousFor: string;
  imageUrl: string;
  imageAlt: string;
};

type DayWeather = {
  date: string;
  weatherCode: number;
  highC: number;
  lowC: number;
  precipitationProbability: number;
  description: string;
  isRainLikely: boolean;
};

const { meta, placeGuides, days, practicalNotes, closing } = data as {
  meta: { dateRange: string; couple: { primary: string; secondary: string }; accommodation: { latitude: number; longitude: number }; closingImageUrl: string };
  placeGuides: Record<string, PlaceGuide>;
  days: Day[];
  practicalNotes: { label: string; value: string }[];
  closing: { title: string; body: string; teaser: string };
};

function weatherCodeToDescription(code: number): string {
  if (code <= 0) return 'Clear';
  if (code <= 2) return 'Mostly clear';
  if (code <= 3) return 'Overcast';
  if (code <= 48) return 'Misty';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Mixed precip';
  if (code <= 82) return 'Showers';
  if (code <= 86) return 'Rain / snow';
  return 'Stormy';
}

function toF(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

function useWeather(): Record<string, DayWeather> {
  const [weather, setWeather] = useState<Record<string, DayWeather>>({});

  useEffect(() => {
    const dates = (days as Day[]).map(d => d.date);
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    const { latitude, longitude } = meta.accommodation;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America/Mexico_City`;

    fetch(url)
      .then(r => r.json())
      .then(json => {
        if (!json.daily) return;
        const result: Record<string, DayWeather> = {};
        const d = json.daily;
        for (let i = 0; i < d.time.length; i++) {
          const code = d.weather_code[i];
          const precip = d.precipitation_probability_max[i];
          result[d.time[i]] = {
            date: d.time[i],
            weatherCode: code,
            highC: d.temperature_2m_max[i],
            lowC: d.temperature_2m_min[i],
            precipitationProbability: precip,
            description: weatherCodeToDescription(code),
            isRainLikely: precip >= 35 || (code >= 51 && code <= 82),
          };
        }
        setWeather(result);
      })
      .catch(() => { /* silently fail - weather is optional */ });
  }, []);

  return weather;
}

const KIND_ICONS: Record<string, string> = {
  arrival: '✈️', meal: '🍽', bar: '🍸', wander: '🚶', transit: '🚗',
  market: '🛍', museum: '🏛', rest: '😴', nightlife: '💃', workshop: '🎨',
  experience: '🎈', shopping: '🛒', flight: '✈️',
};

/* ===== SVG Art Components (desktop-only via CSS) ===== */

function MountainSilhouette({ className }: { className?: string }) {
  return (
    <svg className={`geo-art ${className || ''}`} viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden="true">
      <polygon points="0,200 80,60 140,120 200,30 280,100 340,50 420,110 500,20 560,80 640,40 720,90 800,10 800,200" fill="currentColor" />
    </svg>
  );
}

function StepFretBorder({ className }: { className?: string }) {
  return (
    <svg className={`geo-art ${className || ''}`} viewBox="0 0 600 24" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,24 L0,16 L20,16 L20,8 L40,8 L40,0 L60,0 L60,8 L80,8 L80,16 L100,16 L100,24 L120,24 L120,16 L140,16 L140,8 L160,8 L160,0 L180,0 L180,8 L200,8 L200,16 L220,16 L220,24 L240,24 L240,16 L260,16 L260,8 L280,8 L280,0 L300,0 L300,8 L320,8 L320,16 L340,16 L340,24 L360,24 L360,16 L380,16 L380,8 L400,8 L400,0 L420,0 L420,8 L440,8 L440,16 L460,16 L460,24 L480,24 L480,16 L500,16 L500,8 L520,8 L520,0 L540,0 L540,8 L560,8 L560,16 L580,16 L580,24 L600,24" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FloatingDiamonds({ className }: { className?: string }) {
  return (
    <svg className={`geo-art ${className || ''}`} viewBox="0 0 400 400" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="180" y="20" width="40" height="40" transform="rotate(45 200 40)" className="geo-diamond geo-diamond-1" />
        <rect x="60" y="140" width="28" height="28" transform="rotate(45 74 154)" className="geo-diamond geo-diamond-2" />
        <rect x="310" y="200" width="50" height="50" transform="rotate(45 335 225)" className="geo-diamond geo-diamond-3" />
        <rect x="140" y="300" width="20" height="20" transform="rotate(45 150 310)" className="geo-diamond geo-diamond-4" />
        <rect x="350" y="80" width="32" height="32" transform="rotate(45 366 96)" className="geo-diamond geo-diamond-5" />
      </g>
    </svg>
  );
}

function AztecSun({ className }: { className?: string }) {
  return (
    <svg className={`geo-art ${className || ''}`} viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="100" cy="100" r="30" />
        <circle cx="100" cy="100" r="50" strokeDasharray="8 6" />
        <circle cx="100" cy="100" r="72" strokeDasharray="3 9" />
        {/* Rays */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
          <line
            key={angle}
            x1="100"
            y1="100"
            x2={100 + 90 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 90 * Math.sin((angle * Math.PI) / 180)}
            strokeDasharray="2 12"
            opacity=".4"
          />
        ))}
        {/* Inner triangles (stepped pyramid feel) */}
        {[0, 90, 180, 270].map(angle => (
          <polygon
            key={angle}
            points="100,68 108,52 92,52"
            transform={`rotate(${angle} 100 100)`}
            fill="currentColor"
            opacity=".15"
          />
        ))}
      </g>
    </svg>
  );
}

function GrecaBand({ className }: { className?: string }) {
  return (
    <svg className={`geo-art ${className || ''}`} viewBox="0 0 800 40" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="greca" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
          <path d="M0,20 L10,20 L10,10 L20,10 L20,0 L40,0 L40,10 L30,10 L30,20 L40,20 L40,30 L20,30 L20,40 L0,40 L0,30 L10,30 L10,20" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M40,20 L50,20 L50,10 L60,10 L60,0 L80,0 L80,10 L70,10 L70,20 L80,20 L80,30 L60,30 L60,40 L40,40 L40,30 L50,30 L50,20" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width="800" height="40" fill="url(#greca)" />
    </svg>
  );
}

function TriangleMosaic({ className }: { className?: string }) {
  return (
    <svg className={`geo-art ${className || ''}`} viewBox="0 0 300 300" aria-hidden="true">
      <g fill="currentColor">
        <polygon points="150,10 170,50 130,50" opacity=".08" className="geo-tri geo-tri-1" />
        <polygon points="60,80 90,130 30,130" opacity=".06" className="geo-tri geo-tri-2" />
        <polygon points="240,60 270,110 210,110" opacity=".1" className="geo-tri geo-tri-3" />
        <polygon points="100,180 130,230 70,230" opacity=".05" className="geo-tri geo-tri-4" />
        <polygon points="220,200 250,250 190,250" opacity=".07" className="geo-tri geo-tri-5" />
        <polygon points="160,140 185,180 135,180" opacity=".09" className="geo-tri geo-tri-6" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth=".8">
        <polygon points="40,200 60,240 20,240" opacity=".12" />
        <polygon points="260,150 280,190 240,190" opacity=".1" />
        <polygon points="150,260 175,300 125,300" opacity=".08" />
      </g>
    </svg>
  );
}

function copyAddress(address: string) {
  navigator.clipboard.writeText(address).then(() => {
    // Brief visual feedback handled by CSS animation
  });
}

function formatDayAsText(day: Day): string {
  const lines: string[] = [];
  const dayNum = parseInt(day.id.replace('day-', ''));
  lines.push(`Day ${dayNum}: ${day.title} — ${day.shortLabel}`);
  lines.push(day.subtitle);
  lines.push('');
  lines.push(day.summary);
  lines.push('');
  lines.push(`Transport: ${day.transportSummary}`);
  lines.push('');
  for (const e of day.events) {
    let line = `${e.time} — ${e.title}`;
    if (e.reservationStatus) line += ` [${e.reservationStatus}]`;
    lines.push(line);
    lines.push(`  ${e.description}`);
    if (e.address) lines.push(`  Address: ${e.address}`);
    if (e.mapUrl) lines.push(`  Map: ${e.mapUrl}`);
    if (e.travelNote) lines.push(`  Getting there: ${e.travelNote}`);
    if (e.tips && e.tips.length > 0) {
      for (const tip of e.tips) lines.push(`  - ${tip}`);
    }
    if (e.editorNote) lines.push(`  Note: ${e.editorNote}`);
    if (e.backupPlan) lines.push(`  Backup: ${e.backupPlan}`);
    lines.push('');
  }
  return lines.join('\n');
}

function CopyDayButton({ day }: { day: Day }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formatDayAsText(day)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button className="copy-day-btn" onClick={handleCopy} title="Copy this day's itinerary as text">
      {copied ? 'Copied!' : '📋'}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge status-${status}`}>{status}</span>;
}

function PlaceTag({ event }: { event: Event }) {
  const [copied, setCopied] = useState(false);
  if (!event.address) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyAddress(event.address!);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span className="place-chip" onClick={handleCopy} title="Tap to copy address">
      <span className="place-chip-icon">📍</span>
      <span className="place-chip-address">{event.address}</span>
      {event.mapUrl && (
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="place-chip-map"
          onClick={(e) => e.stopPropagation()}
          title="Open in Maps"
        >
          ↗
        </a>
      )}
      {copied && <span className="copied-toast">Copied!</span>}
    </span>
  );
}

function EventRow({ event }: { event: Event }) {
  if (event.kind === 'transit') return null;
  return (
    <div className="event-row">
      <span className="event-row-time">{event.time}</span>
      <span className="event-row-icon">{KIND_ICONS[event.kind] || '•'}</span>
      <div className="event-row-body">
        <span className="event-row-title">{event.title}</span>
        {event.reservationStatus && <StatusBadge status={event.reservationStatus} />}
        {event.mapUrl && (
          <a
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="event-row-map"
            onClick={(e) => e.stopPropagation()}
          >
            📍 Map
          </a>
        )}
        {event.transportHint === 'uber' && <span className="transport-tag" title="Uber needed">🚗</span>}
      </div>
    </div>
  );
}

function EventCardExpanded({ event }: { event: Event }) {
  const guide = event.placeKey ? placeGuides[event.placeKey] : null;

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div className="event-card-meta">
          <span className="event-card-time">{event.time}</span>
          <span className="event-card-kind">{event.kind}</span>
          {event.reservationStatus && <StatusBadge status={event.reservationStatus} />}
        </div>
        <h3>{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>
      </div>

      {event.address && (
        <div className="event-card-location">
          <PlaceTag event={event} />
        </div>
      )}

      {event.travelNote && <p className="event-card-travel">{event.travelNote}</p>}

      {event.tips && event.tips.length > 0 && (
        <ul className="event-card-tips">
          {event.tips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      )}

      {event.editorNote && <p className="event-card-note">{event.editorNote}</p>}
      {event.backupPlan && <p className="event-card-note">Backup: {event.backupPlan}</p>}

      {guide && (
        <div className="guide-card">
          <img src={guide.imageUrl} alt={guide.imageAlt} loading="lazy" />
          <div className="guide-card-copy">
            <strong>{guide.name}</strong>
            <span>{guide.summary}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function WeatherChip({ weather }: { weather: DayWeather }) {
  return (
    <div className={`weather-chip ${weather.isRainLikely ? 'rainy' : ''}`}>
      <span className="weather-desc">{weather.description}</span>
      <span className="weather-temps">{toF(weather.highC)}°F / {toF(weather.lowC)}°F</span>
      {weather.precipitationProbability > 0 && (
        <small className="weather-precip">{weather.precipitationProbability}% rain</small>
      )}
    </div>
  );
}

type DayView = 'collapsed' | 'brief' | 'expanded';

function DaySection({ day, view, onCycleView, weather }: { day: Day; view: DayView; onCycleView: () => void; weather?: DayWeather }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const dayNum = parseInt(day.id.replace('day-', ''));
  const isPast = view === 'collapsed';

  return (
    <section className={`day-section ${view === 'expanded' ? 'expanded' : ''} ${isPast ? 'past' : ''}`}>
      <div className="day-header-row">
        <button className="day-header" onClick={onCycleView} aria-expanded={view !== 'collapsed'}>
          <div className="day-header-left">
            <span className="day-number">Day {dayNum}</span>
            <span className="day-date">{day.shortLabel}</span>
          </div>
          <div className="day-header-center">
            <h2 className="day-title">{day.title}</h2>
            {view !== 'collapsed' && <p className="day-subtitle">{day.subtitle}</p>}
          </div>
          <div className="day-header-right">
            {weather && <span className="day-weather-mini">{weather.description} {toF(weather.highC)}°</span>}
            <span className="day-event-count">{day.events.length} stops</span>
            <span className={`chevron ${view !== 'collapsed' ? 'open' : ''}`}>▾</span>
          </div>
        </button>
        <CopyDayButton day={day} />
      </div>

      {/* Brief: practical schedule */}
      {view === 'brief' && (
        <div className="day-brief">
          <div className="day-brief-events">
            {day.events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
          <button className="expand-btn" onClick={onCycleView}>
            See full details for this day →
          </button>
        </div>
      )}

      {/* Expanded: full cinematic view */}
      {view === 'expanded' && (
        <div className="day-expanded" ref={contentRef}>
          <div className="day-expanded-intro">
            <p className="day-summary">{day.summary}</p>
            <div className="day-meta">
              <div className="day-transport">
                <span className="transport-icon">🚗</span>
                <span>{day.transportSummary}</span>
              </div>
              {weather && <WeatherChip weather={weather} />}
            </div>
          </div>

          <div className="day-expanded-events">
            {day.events.map(event => (
              <EventCardExpanded key={event.id} event={event} />
            ))}
          </div>

          <button className="collapse-btn" onClick={onCycleView}>
            ↑ Collapse day {dayNum}
          </button>
        </div>
      )}
    </section>
  );
}

function NotesSection() {
  return (
    <section id="notes" className="notes-section section-pad">
      <div className="section-heading">
        <span className="eyebrow">Reference</span>
        <h2>Practical Notes</h2>
      </div>
      <div className="notes-grid">
        {practicalNotes.map((note, i) => (
          <div key={i} className="note-card">
            <strong>{note.label}</strong>
            <p>{note.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section className="closing-section section-pad">
      <div className="closing-card">
        <h2>{closing.title}</h2>
        <p>{closing.body}</p>
        <p className="closing-teaser">{closing.teaser}</p>
      </div>
    </section>
  );
}

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 1040px)').matches;
}

function getInitialViews(): Record<string, DayView> {
  const today = getToday();
  const desktop = isDesktop();
  const views: Record<string, DayView> = {};
  for (const day of days as Day[]) {
    if (day.date < today) {
      views[day.id] = 'collapsed';
    } else {
      views[day.id] = desktop ? 'expanded' : 'brief';
    }
  }
  return views;
}

export default function App() {
  const [dayViews, setDayViews] = useState<Record<string, DayView>>(getInitialViews);
  const dayRefs = useRef<Record<string, HTMLElement | null>>({});
  const weather = useWeather();

  const cycleView = (dayId: string) => {
    setDayViews(prev => {
      const current = prev[dayId] || 'brief';
      let next: DayView;
      if (current === 'collapsed') next = 'brief';
      else if (current === 'brief') next = 'expanded';
      else next = 'brief';
      return { ...prev, [dayId]: next };
    });
  };

  // Scroll to day when it expands
  const prevViews = useRef(dayViews);
  useEffect(() => {
    for (const id of Object.keys(dayViews)) {
      if (dayViews[id] === 'expanded' && prevViews.current[id] !== 'expanded' && dayRefs.current[id]) {
        dayRefs.current[id]!.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    prevViews.current = dayViews;
  }, [dayViews]);

  return (
    <div className="app-shell">
      {/* Hero */}
      <header className="hero section-pad">
        <nav className="hero-nav">
          <a href="/">Aditya & Chhaya</a>
          <a href="/trips/">All Trips</a>
        </nav>
        <span className="eyebrow">Honeymoon Itinerary</span>
        <h1>
          <span>Mexico</span>
          <span>City</span>
        </h1>
        <p className="hero-whisper">{meta.dateRange} · 6 days · {(days as Day[]).reduce((sum, d) => sum + d.events.length, 0)} moments planned</p>

        {/* Decorative hero art — visible on desktop only */}
        <div className="hero-art" aria-hidden="true">
          <AztecSun className="hero-sun" />
          <FloatingDiamonds className="hero-diamonds" />
          <TriangleMosaic className="hero-triangles" />
        </div>

        <div className="hero-actions">
          <a href="#days" className="primary-link">Browse the days</a>
          <a href="#notes" className="secondary-link">Practical notes</a>
        </div>
      </header>

      {/* Mountain silhouette divider */}
      <div className="mountain-divider" aria-hidden="true">
        <MountainSilhouette className="mountains-back" />
        <MountainSilhouette className="mountains-front" />
      </div>

      {/* Greca ornamental band */}
      <div className="greca-divider" aria-hidden="true">
        <GrecaBand />
      </div>

      {/* Day-by-day itinerary */}
      <main id="days" className="days-section section-pad">
        <div className="section-heading">
          <span className="eyebrow">Day by day</span>
          <h2>The Itinerary</h2>
          <p className="section-desc">Tap a day to see the schedule. Past days are collapsed — tap to open.</p>
        </div>

        <div className="days-list">
          {(days as Day[]).map(day => (
            <div key={day.id} ref={el => { dayRefs.current[day.id] = el; }}>
              <DaySection
                day={day}
                view={dayViews[day.id] || 'brief'}
                onCycleView={() => cycleView(day.id)}
                weather={weather[day.date]}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Step-fret divider before notes */}
      <div className="stepfret-divider" aria-hidden="true">
        <StepFretBorder />
      </div>

      {/* Practical Notes */}
      <NotesSection />

      {/* Closing */}
      <ClosingSection />

      {/* Floating background geometry — desktop only */}
      <div className="bg-geo" aria-hidden="true">
        <TriangleMosaic className="bg-geo-left" />
        <FloatingDiamonds className="bg-geo-right" />
      </div>
    </div>
  );
}
