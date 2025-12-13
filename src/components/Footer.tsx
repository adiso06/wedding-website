import React from 'react';
import './Footer.css';

interface FooterProps {
  onSubscribeClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onSubscribeClick }) => {
  return (
    <footer className="footer border-top">
      <div className="footer-content">
        <div className="footer-section">
          <h6 className="footer-title">ABOUT THIS PUBLICATION</h6>
          <p className="footer-text">
            The Daily Nuptial is a special edition publication commemorating the
            union of Sarah Elizabeth Thompson and James Michael Anderson.
            All stories, dates, and details are subject to change based on
            meteorological conditions and champagne availability.
          </p>
        </div>

        <div className="footer-section">
          <h6 className="footer-title">ATTENDANCE MANDATORY</h6>
          <p className="footer-text">
            Your presence is requested at the ceremony. Reply required by August 1st, 2024.
          </p>
          <button onClick={onSubscribeClick} className="subscribe-button">
            SUBSCRIBE (RSVP)
          </button>
        </div>

        <div className="footer-section">
          <h6 className="footer-title">CONTACT THE EDITORS</h6>
          <p className="footer-text">
            Questions? Corrections? Concerns?<br />
            Email: <a href="mailto:sarah.james.wedding@gmail.com">sarah.james.wedding@gmail.com</a>
          </p>
        </div>
      </div>

      <div className="footer-bottom border-top">
        <div className="footer-legal">
          <p>© 2024 The Daily Nuptial. All rights reserved.</p>
          <p className="footer-small">
            No part of this celebration may be reproduced without the express written
            consent of the bride and groom. Violations will result in mandatory
            karaoke performances.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
