import React from 'react';
import './Masthead.css';

const Masthead: React.FC = () => {
  return (
    <header className="masthead border-bottom">
      <div className="masthead-container">
        <div className="masthead-top">
          <div className="masthead-ear-left">
            <div className="ear-title ear-title-large">OFFICIAL WEDDING INVITATION</div>
            <div className="ear-subtitle">Keep this issue for your records.<br/>Attendance is mandatory for close allies.</div>
          </div>

          <div className="masthead-center">
            <div className="masthead-meta">
              <span className="masthead-date">Sunday, March 15, 2026</span>
              <span className="masthead-separator">•</span>
              <span className="masthead-location">Corona, CA</span>
              <span className="masthead-separator">•</span>
              <span className="masthead-vol">Vol. 1</span>
            </div>
            <div className="masthead-logo">
              <h1>The Wedding Times</h1>
            </div>
          </div>

          <div className="masthead-ear-right">
            <div className="weather-widget">
              <span className="weather-icon">🌤</span>
              <span className="weather-text">Forecast: 72°/55°<br/>Conditions favorable for outdoor procession.</span>
            </div>
            <a
              href="https://www.theknot.com/us/chhaya-arora-and-aditya-sood-mar-2026/rsvp"
              target="_blank"
              rel="noopener noreferrer"
              className="subscribe-btn"
            >
              RSVP
            </a>
          </div>
        </div>
      </div>
      
      {/* Ticker bar hidden for now */}
      {/* <div className="ticker-bar">
        <div className="ticker-content">
          BREAKING: RSVP DEADLINE SET FOR FEBRUARY 1ST ... HOTEL BLOCK FILLING FAST ... GROOM PROMISES TO DANCE ... BRIDE NEGOTIATING HONEYMOON TERMS ...
        </div>
      </div> */}
    </header>
  );
};

export default Masthead;
