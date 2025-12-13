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
            <p className="info-note">Doors open at 6:00 PM. Dinner service begins at 7:00 PM.</p>
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
            <h2>Evening Schedule</h2>
            <ul className="info-list">
              <li><strong>6:00 PM:</strong> Doors open, cocktail hour</li>
              <li><strong>7:00 PM:</strong> Grand entrance and introductions</li>
              <li><strong>7:30 PM:</strong> Dinner service begins</li>
              <li><strong>8:30 PM:</strong> First dance and special performances</li>
              <li><strong>9:00 PM:</strong> Dancing and celebration</li>
              <li><strong>12:00 AM:</strong> Reception concludes</li>
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
            <p className="info-note">Please let us know about any dietary restrictions in your RSVP.</p>
          </div>

          <div className="info-section">
            <h2>Entertainment</h2>
            <ul className="info-list">
              <li>DJ and dancing throughout the evening</li>
              <li>Special performances by friends and family</li>
              <li>Photo opportunities and photo booth</li>
              <li>Open bar with beer, wine, and cocktails</li>
            </ul>
          </div>

          <div className="info-section">
            <h2>Parking & Transportation</h2>
            <p>Free parking is available at the venue. Since the reception venue is different from the ceremony location, please plan your transportation accordingly.</p>
            <p className="info-note">⚠️ If you plan to drink, please arrange for a designated driver or rideshare service.</p>
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
