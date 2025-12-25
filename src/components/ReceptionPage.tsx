import React from 'react';
import './InfoPage.css';

interface ReceptionPageProps {
  onClose: () => void;
}

const ReceptionPage: React.FC<ReceptionPageProps> = ({ onClose }) => {
  return (
    <div className="info-page-overlay" onClick={onClose}>
      <div className="info-page-container" onClick={(e) => e.stopPropagation()}>
        <button className="info-page-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className="info-page-content">
          <h1 className="info-page-title">Wedding Reception</h1>
          
          <div className="info-section">
            <h2>When</h2>
            <p className="info-highlight">Saturday, March 15, 2025</p>
            <p>6:00 PM - 12:00 AM</p>
          </div>

          <div className="info-section">
            <h2>Where</h2>
            <p className="info-highlight">Majestic Banquet Hall</p>
            <p>13838 Roswell Ave</p>
            <p>Chino, CA 91710</p>
            <a 
              href="https://maps.google.com/?q=Majestic+Banquet+Hall+Chino" 
              target="_blank" 
              rel="noopener noreferrer"
              className="info-link"
            >
              Get Directions →
            </a>
          </div>

          <div className="info-section">
            <h2>What to Expect</h2>
            <ul className="info-list">
              <li><strong>6:00 PM–7:00 PM - COCKTAIL HOUR</strong><br/>Hors d'oeuvres and cocktails to kick off the night.</li>
              <li><strong>7:00 PM–12:00 AM - RECEPTION</strong><br/>Please join us for a night of partying to celebrate us as newlyweds!</li>
            </ul>
          </div>

          <div className="info-section highlight-box">
            <h2>Dress Code</h2>
            <p><strong>Indo-Western fusion or Western formal attire</strong></p>
            <p>Feel free to wear traditional Indian clothing, Western formal wear (suits, cocktail dresses, gowns), or a creative fusion of both styles.</p>
            <p className="info-note">This is your chance to dress up and look amazing!</p>
          </div>

          <div className="info-section">
            <h2>Dinner</h2>
            <p>A delicious multi-course Indian and fusion dinner will be served. Vegetarian and non-vegetarian options available.</p>
          </div>

          <div className="info-section">
            <h2>Entertainment</h2>
            <ul className="info-list">
              <li>DJ and dancing throughout the evening</li>
              <li>Special performances by friends and family</li>
              <li>Open bar with beer, wine, and cocktails</li>
            </ul>
          </div>

          <div className="info-section">
            <h2>Gift Drop Box</h2>
            <p>A secure card and gift box will be available at the reception entrance for your convenience.</p>
          </div>

          <div className="info-section">
            <p className="info-note">📧 Questions? Please contact us through the RSVP form or reach out to the families directly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionPage;



