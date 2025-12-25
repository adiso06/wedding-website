import React from 'react';
import './InfoPage.css';

interface RegistryPageProps {
  onClose: () => void;
}

const RegistryPage: React.FC<RegistryPageProps> = ({ onClose }) => {
  return (
    <div className="info-page-overlay" onClick={onClose}>
      <div className="info-page-container" onClick={(e) => e.stopPropagation()}>
        <button className="info-page-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className="info-page-content">
          <h1 className="info-page-title">Registry & Gifts</h1>
          
          <div className="info-section center-text">
            <p className="info-highlight large-text">Your Presence is Our Present</p>
            <p>Your love, support, and presence at our wedding is the greatest gift we could ask for. Having you celebrate with us means the world!</p>
          </div>

          <div className="info-section">
            <h2>For Those Who Wish to Give</h2>
            <p>If you would still like to honor us with a gift, we would be deeply grateful for contributions toward our future together. As we live in New York but are celebrating in California, we kindly ask for no boxed gifts to avoid the logistics of shipping them cross-country.</p>
          </div>

          <div className="info-section">
            <h2>How to Give</h2>
            
            <div className="gift-option">
              <h3>💳 Digital Transfer</h3>
              <p>For your convenience, you can send digital contributions via:</p>
              <ul className="info-list">
                <li><strong>Venmo:</strong> @ChhaySood</li>
                <li><strong>Zelle:</strong> Contact us for details</li>
                <li><strong>Other payment apps:</strong> Reach out to us directly</li>
              </ul>
              <p className="info-note">Details will be shared with RSVP'd guests closer to the wedding date.</p>
            </div>

            <div className="gift-option">
              <h3>💌 Cards & Checks</h3>
              <p>If you prefer a traditional approach:</p>
              <ul className="info-list">
                <li>A secure gift box will be available at the reception entrance</li>
                <li>Cards and envelopes will be safely collected throughout the evening</li>
                <li>Checks can be made out to "Chhaya Arora" or "Aditya Sood"</li>
              </ul>
            </div>
          </div>

          <div className="info-section">
            <p className="info-note">📧 Questions about gifts? Please don't hesitate to reach out through the RSVP form or contact our families directly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistryPage;



