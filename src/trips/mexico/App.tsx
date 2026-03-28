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

type Reservation = {
  dateLabel: string;
  venue: string;
  time: string;
  status: string;
  confirmationCode?: string;
  note?: string;
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

const { meta, placeGuides, days, reservations, practicalNotes, closing } = data as {
  meta: { dateRange: string; couple: { primary: string; secondary: string }; accommodation: { latitude: number; longitude: number }; closingImageUrl: string };
  placeGuides: Record<string, PlaceGuide>;
  days: Day[];
  reservations: Reservation[];
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

function copyAddress(address: string) {
  navigator.clipboard.writeText(address).then(() => {
    // Brief visual feedback handled by CSS animation
  });
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
  return (
    <div className="event-row">
      <span className="event-row-time">{event.time}</span>
      <span className="event-row-icon">{KIND_ICONS[event.kind] || '•'}</span>
      <div className="event-row-body">
        <span className="event-row-title">{event.title}</span>
        {event.reservationStatus && <StatusBadge status={event.reservationStatus} />}
        {event.address && <PlaceTag event={event} />}
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

function DaySection({ day, isExpanded, onToggle, weather }: { day: Day; isExpanded: boolean; onToggle: () => void; weather?: DayWeather }) {
  const contentRef = useRef<HTMLDivElement>(null);

  const keyLocations = day.events.filter(e => e.address);
  const dayNum = parseInt(day.id.replace('day-', ''));

  return (
    <section className={`day-section ${isExpanded ? 'expanded' : ''}`}>
      <button className="day-header" onClick={onToggle} aria-expanded={isExpanded}>
        <div className="day-header-left">
          <span className="day-number">Day {dayNum}</span>
          <span className="day-date">{day.shortLabel}</span>
        </div>
        <div className="day-header-center">
          <h2 className="day-title">{day.title}</h2>
          <p className="day-subtitle">{day.subtitle}</p>
        </div>
        <div className="day-header-right">
          {weather && <span className="day-weather-mini">{weather.description} {toF(weather.highC)}°</span>}
          <span className="day-event-count">{day.events.length} stops</span>
          <span className={`chevron ${isExpanded ? 'open' : ''}`}>▾</span>
        </div>
      </button>

      {/* Collapsed: brief practical schedule */}
      {!isExpanded && (
        <div className="day-brief">
          <div className="day-brief-events">
            {day.events.map(event => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
          {keyLocations.length > 0 && (
            <div className="day-brief-locations">
              <span className="locations-label">Key locations:</span>
              {keyLocations.map(event => (
                <PlaceTag key={event.id} event={event} />
              ))}
            </div>
          )}
          <button className="expand-btn" onClick={onToggle}>
            See full details for this day →
          </button>
        </div>
      )}

      {/* Expanded: full cinematic view */}
      {isExpanded && (
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

          <button className="collapse-btn" onClick={onToggle}>
            ↑ Collapse day {dayNum}
          </button>
        </div>
      )}
    </section>
  );
}

function ReservationsSection() {
  return (
    <section className="reservations-section section-pad">
      <div className="section-heading">
        <span className="eyebrow">Practical</span>
        <h2>Reservations</h2>
        <p className="section-desc">The practical layer.</p>
      </div>
      <div className="reservation-table">
        {reservations.map((r, i) => (
          <div key={i} className="reservation-row">
            <div className="res-venue">{r.venue}</div>
            <StatusBadge status={r.status} />
            <div className="res-date">{r.dateLabel} · <span className="res-time">{r.time}</span></div>
            {(r.confirmationCode || r.note) && <div className="res-note">{r.confirmationCode || r.note}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function NotesSection() {
  return (
    <section className="notes-section section-pad">
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

export default function App() {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const dayRefs = useRef<Record<string, HTMLElement | null>>({});
  const weather = useWeather();

  const toggleDay = (dayId: string) => {
    setExpandedDay(prev => prev === dayId ? null : dayId);
  };

  useEffect(() => {
    if (expandedDay && dayRefs.current[expandedDay]) {
      dayRefs.current[expandedDay]!.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [expandedDay]);

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

        <div className="hero-actions">
          <a href="#days" className="primary-link">Browse the days</a>
          <a href="#reservations" className="secondary-link">Jump to reservations</a>
        </div>
      </header>

      {/* Day-by-day itinerary */}
      <main id="days" className="days-section section-pad">
        <div className="section-heading">
          <span className="eyebrow">Day by day</span>
          <h2>The Itinerary</h2>
          <p className="section-desc">Tap any day for the brief schedule. Tap "See full details" to expand the cinematic version.</p>
        </div>

        <div className="days-list">
          {(days as Day[]).map(day => (
            <div key={day.id} ref={el => { dayRefs.current[day.id] = el; }}>
              <DaySection
                day={day}
                isExpanded={expandedDay === day.id}
                onToggle={() => toggleDay(day.id)}
                weather={weather[day.date]}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Reservations */}
      <div id="reservations">
        <ReservationsSection />
      </div>

      {/* Practical Notes */}
      <NotesSection />

      {/* Closing */}
      <ClosingSection />
    </div>
  );
}
