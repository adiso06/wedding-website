import React from 'react';
import './InfoPage.css';

interface AccommodationsPageProps {
  onClose: () => void;
}

const AccommodationsPage: React.FC<AccommodationsPageProps> = ({ onClose }) => {
  return (
    <div className="info-page-overlay" onClick={onClose}>
      <div className="info-page-container" onClick={(e) => e.stopPropagation()}>
        <button className="info-page-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className="info-page-content">
          <h1 className="info-page-title">Travel</h1>
          
          <div className="info-section">
            <h2>Flying In</h2>

            <div className="airport-option">
              <h3>Ontario International Airport (ONT) ⭐ Best Option</h3>
              <p className="info-highlight">Adjacent to venue</p>
              <p><strong>Distance:</strong> ~2 miles to venue</p>
              <p><strong>Travel Time:</strong> ~5–10 minutes</p>
              <p className="info-note">Note: The venue is practically next door to this airport. Rental cars and rideshares are readily available.</p>
            </div>

            <div className="airport-option">
              <h3>John Wayne Airport (SNA)</h3>
              <p><strong>Distance:</strong> ~35 miles to venue</p>
              <p><strong>Travel Time:</strong> ~40–60 minutes</p>
              <p className="info-note">Note: A good alternative if ONT flights are unavailable; significantly closer than LAX.</p>
            </div>

            <div className="airport-option">
              <h3>Los Angeles International (LAX)</h3>
              <p><strong>Distance:</strong> ~55 miles to venue</p>
              <p><strong>Travel Time:</strong> ~60–90+ minutes (highly dependent on traffic)</p>
              <p className="info-note">Note: Major international hub with the most flight options, but requires a longer drive through heavy traffic.</p>
            </div>
          </div>

          <div className="info-section">
            <h2>Staying</h2>

            <div className="hotel-card">
              <h3>The Mission Inn Hotel & Spa (Riverside, CA)</h3>
              <p><strong>Vibe:</strong> Historic, scenic, and unique. A destination in itself. Highly recommended.</p>
              <p><strong>Distance:</strong> ~15 minutes from venue.</p>
            </div>

            <div className="hotel-card">
              <h3>Ayres Hotel Chino Hills (Chino Hills, CA)</h3>
              <p><strong>Vibe:</strong> Boutique-style and scenic. Located in a nice area near The Shoppes at Chino Hills.</p>
              <p><strong>Distance:</strong> ~15 minutes from venue.</p>
            </div>

            <div className="hotel-card">
              <h3>DoubleTree by Hilton Ontario Airport (Ontario, CA)</h3>
              <p><strong>Vibe:</strong> Modern and convenient. Located very close to the airport and wedding venue.</p>
              <p><strong>Distance:</strong> ~5 minutes from venue.</p>
            </div>
          </div>

          <div className="info-section">
            <h2>Transportation</h2>
            <p className="info-highlight">Car Rentals are recommended over Ubers</p>
            <p>The ceremony and reception are at different venues in the Chino Hills area. A rental car will give you the most flexibility during your stay.</p>
          </div>

          <div className="info-section">
            <p className="info-note">📧 Questions about travel or accommodations? Please reach out through the RSVP form!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationsPage;



