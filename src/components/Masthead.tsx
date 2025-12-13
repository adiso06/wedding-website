import React from 'react';
import './Masthead.css';

const Masthead: React.FC = () => {
  return (
    <header className="masthead border-bottom">
      {/* Top bar with "ears" */}
      <div className="masthead-top">
        <div className="ear ear-left">
          <div className="ear-label">THE WEATHER</div>
          <div className="ear-content">Napa Valley, CA</div>
          <div className="ear-detail">Partly Sunny, 75°F</div>
        </div>

        <div className="ear ear-right">
          <div className="ear-label">PRICE</div>
          <div className="ear-content">Free</div>
          <div className="ear-detail">RSVP Required</div>
        </div>
      </div>

      {/* Main masthead */}
      <div className="masthead-main">
        <h1 className="masthead-title">The Daily Nuptial</h1>
        <div className="masthead-subtitle">All the News That's Fit to Celebrate</div>
      </div>

      {/* Dateline bar */}
      <div className="dateline-bar border-top border-bottom">
        <div className="dateline-content">
          <span className="dateline-item">SATURDAY, OCTOBER 12, 2024</span>
          <span className="dateline-separator">|</span>
          <span className="dateline-item">NAPA VALLEY, CALIFORNIA</span>
          <span className="dateline-separator">|</span>
          <span className="dateline-ticker">COUNTDOWN: 287 DAYS UNTIL THE EVENT</span>
        </div>
      </div>
    </header>
  );
};

export default Masthead;
