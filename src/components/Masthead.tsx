import React from 'react';
import './Masthead.css';

interface MastheadProps {
  onRSVPClick?: () => void;
}

const Masthead: React.FC<MastheadProps> = ({ onRSVPClick }) => {
  return (
    <header className="masthead border-bottom">
      <div className="masthead-container">
        <div className="masthead-top">
          <div className="masthead-left">
            <span className="masthead-date">Saturday, October 12, 2024</span>
            <span className="masthead-separator">•</span>
            <span className="masthead-location">Napa Valley, CA</span>
          </div>

          <div className="masthead-logo">
            <h1>The Wedding Times</h1>
          </div>

          <div className="masthead-right">
            <button className="subscribe-btn" onClick={onRSVPClick}>RSVP</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Masthead;
