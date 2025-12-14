import React from 'react';
import './InfoPage.css';

interface CeremonyPageProps {
  onClose: () => void;
}

const CeremonyPage: React.FC<CeremonyPageProps> = ({ onClose }) => {
  return (
    <div className="info-page-overlay" onClick={onClose}>
      <div className="info-page-container" onClick={(e) => e.stopPropagation()}>
        <button className="info-page-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className="info-page-content">
          <h1 className="info-page-title">Wedding Ceremony</h1>
          
          <div className="info-section">
            <h2>When</h2>
            <p className="info-highlight">Saturday, March 15, 2025</p>
            <p>11:00 AM - 1:30 PM</p>
            <p className="info-note">⏰ Important: Baraat procession begins at 10:30 AM sharp. Please arrive by 10:15 AM to participate.</p>
          </div>

          <div className="info-section">
            <h2>Where</h2>
            <p className="info-highlight">BAPS Shri Swaminarayan Mandir</p>
            <p>15100 Fairfield Ranch Rd</p>
            <p>Chino Hills, CA 91709</p>
            <a 
              href="https://maps.google.com/?q=BAPS+Shri+Swaminarayan+Mandir+Chino+Hills" 
              target="_blank" 
              rel="noopener noreferrer"
              className="info-link"
            >
              Get Directions →
            </a>
          </div>

          <div className="info-section">
            <h2>About the Venue</h2>
            <p>The BAPS Mandir in Chino Hills is a stunning architectural masterpiece featuring hand-carved Italian Carrara marble and Indian pink sandstone. The temple includes five pinnacles, two large domes, and 122 intricately carved pillars.</p>
          </div>

          <div className="info-section">
            <h2>What to Expect</h2>
            <ul className="info-list">
              <li><strong>Baraat (10:30 AM):</strong> A joyous processional celebration with music and dancing as the groom arrives</li>
              <li><strong>Hindu Ceremony (11:00 AM):</strong> Traditional wedding rituals including the exchange of garlands, sacred fire ceremony, and seven vows</li>
              <li><strong>Lunch (1:30 PM):</strong> Traditional Indian meal served at the temple</li>
            </ul>
          </div>

          <div className="info-section highlight-box">
            <h2>Dress Code</h2>
            <p><strong>Indian attire is strongly preferred; formal suits are acceptable.</strong></p>
            <p className="info-note">Temple Requirements:</p>
            <ul className="info-list">
              <li>Modest clothing required (shoulders, back, chest, and knees must be covered)</li>
              <li>Remove shoes before entering the temple</li>
              <li>Shoes can be left at the designated area</li>
            </ul>
          </div>

          <div className="info-section">
            <h2>Parking & Arrival</h2>
            <p>Ample parking is available at the temple. Please arrive early to allow time for parking and removing shoes before the Baraat begins at 10:30 AM.</p>
          </div>

          <div className="info-section">
            <h2>Additional Information</h2>
            <ul className="info-list">
              <li>Photography inside the temple is not permitted during the ceremony</li>
              <li>The ceremony will be approximately 2-3 hours</li>
              <li>Seating is available inside the temple</li>
              <li>Vegetarian lunch will be provided after the ceremony</li>
            </ul>
          </div>

          <div className="info-section">
            <p className="info-note">📧 Questions? Please contact us through the RSVP form or reach out to the families directly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CeremonyPage;


