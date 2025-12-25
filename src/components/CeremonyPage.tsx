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
            <p>9:00 AM - 2:00 PM</p>
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
              <li><strong>9:00 AM–9:45 AM - ADITYA'S BARAAT</strong><br/>Meet up: 8:45 AM<br/>The wedding procession for the groom involving live music and dancing. Please note that the time here is prompt.</li>
              <li><strong>10:00 AM–12:30 PM - WEDDING CEREMONY</strong><br/>The bride and groom take seven steps and vows around the fire to represent the beginning of their journey together.</li>
              <li><strong>12:30 PM–2:00 PM - LUNCH</strong><br/>Traditional Indian vegetarian meal after ceremony</li>
            </ul>
          </div>

          <div className="info-section highlight-box">
            <h2>Dress Code</h2>
            <p><strong>Indian attire or formal western attire will be great.</strong></p>
          </div>

          <div className="info-section">
            <h2>Parking & Arrival</h2>
            <p>Ample parking is available at the temple. Please arrive early to allow time for parking before the Baraat begins at 9:00 AM.</p>
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



