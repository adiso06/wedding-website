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
          <h1 className="info-page-title">Accommodations</h1>
          
          <div className="info-section">
            <h2>Recommended Hotels</h2>
            
            <div className="hotel-card">
              <h3>The Mission Inn Hotel & Spa</h3>
              <p className="info-highlight">Primary Hotel with Group Rate</p>
              <p>3649 Mission Inn Avenue</p>
              <p>Riverside, CA 92501</p>
              <p className="info-note">📞 Call the hotel directly and mention the Arora-Sood wedding for group rate</p>
              <a 
                href="https://www.missioninn.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="info-link"
              >
                Visit Website →
              </a>
            </div>

            <div className="hotel-card">
              <h3>Additional Hotel Options</h3>
              <p>More hotel recommendations coming soon. Check back for updates!</p>
              <p className="info-note">In the meantime, look for hotels in Chino Hills, Ontario, or Riverside.</p>
            </div>
          </div>

          <div className="info-section highlight-box">
            <h2>Important: Car Rental Required</h2>
            <p>⚠️ <strong>You will need a car during your stay.</strong></p>
            <p>The ceremony and reception are at different venues in the Chino Hills area. There is no shuttle service, so a rental car is essential.</p>
            <p className="info-note">Book your rental car early, especially for the mid-March timeframe!</p>
          </div>

          <div className="info-section">
            <h2>Flying In</h2>
            <p>Three airports serve the Chino Hills area:</p>
            
            <div className="airport-option">
              <h3>Ontario International Airport (ONT)</h3>
              <p className="info-highlight">⭐ Recommended - Closest Option</p>
              <p>Distance: ~30 miles to Chino Hills (~30-40 minutes)</p>
              <p>Rental car agencies available on-site</p>
            </div>

            <div className="airport-option">
              <h3>Los Angeles International (LAX)</h3>
              <p>Distance: ~60 miles to Chino Hills (~60-90 minutes depending on traffic)</p>
              <p>Major international hub with more flight options</p>
              <p>All major rental car agencies available</p>
            </div>

            <div className="airport-option">
              <h3>John Wayne Airport (SNA)</h3>
              <p>Distance: ~45 miles to Chino Hills (~45-60 minutes)</p>
              <p>Orange County airport, good alternative</p>
            </div>
          </div>

          <div className="info-section">
            <h2>Alternative Lodging</h2>
            <p>If you prefer alternative accommodations, consider:</p>
            <ul className="info-list">
              <li><strong>Airbnb/VRBO:</strong> Search in Chino Hills, Diamond Bar, or surrounding areas</li>
              <li><strong>Hotels near Ontario Airport:</strong> Convenient and often more affordable</li>
              <li><strong>Riverside Hotels:</strong> Near the Mission Inn, about 20-30 minutes from venues</li>
            </ul>
            <p className="info-note">💡 Tip: Book early as availability decreases closer to the wedding date!</p>
          </div>

          <div className="info-section">
            <h2>Weather & What to Pack</h2>
            <p>Southern California in mid-March is beautiful!</p>
            <ul className="info-list">
              <li><strong>Temperature:</strong> Daytime 68-72°F (20-22°C), Evening 48-50°F (9-10°C)</li>
              <li><strong>Weather:</strong> Typically sunny and dry (minimal rain in March)</li>
              <li><strong>What to Bring:</strong> Light layers for daytime, jacket or shawl for evenings, sunscreen</li>
            </ul>
          </div>

          <div className="info-section">
            <h2>Local Area</h2>
            <p>While you're in Southern California, consider extending your trip to visit:</p>
            <ul className="info-list">
              <li><strong>Disneyland Resort:</strong> 30 minutes away</li>
              <li><strong>Downtown Los Angeles:</strong> 45 minutes</li>
              <li><strong>Orange County Beaches:</strong> 40 minutes</li>
              <li><strong>Wine Country (Temecula):</strong> 45 minutes south</li>
            </ul>
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
