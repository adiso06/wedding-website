import { useState, ReactNode } from 'react';
import './BundleIntro.css';

interface BundleIntroProps {
  children: ReactNode;
  onRSVPClick?: () => void;
}

const BundleIntro = ({ children, onRSVPClick }: BundleIntroProps) => {
  // Stages: 'locked' (1) -> 'unlocked' (2 - flipped) -> 'hidden' (3 - exit)
  const [stage, setStage] = useState<'locked' | 'unlocked' | 'hidden'>('locked');
  const [isExiting, setIsExiting] = useState(false);

  const handleUntie = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent double clicks
    if (stage === 'locked') {
      setStage('unlocked');
    }
  };

  const handleEnterSite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExiting(true);
    // Wait for roll-up animation
    setTimeout(() => {
      setStage('hidden');
    }, 1200);
  };

  const handleRSVP = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExiting(true);
    // Wait for roll-up animation then trigger RSVP
    setTimeout(() => {
      setStage('hidden');
      if (onRSVPClick) onRSVPClick();
    }, 1200);
  };

  if (stage === 'hidden') {
    return <>{children}</>;
  }

  return (
    <div className="bundle-wrapper">
      {/* Real website underneath */}
      <div className={`bundle-content ${isExiting ? 'visible' : 'hidden'}`}>
        {children}
      </div>

      {/* OVERLAY */}
      <div className={`bundle-overlay ${isExiting ? 'exiting' : ''}`}>
        
        {/* The Bundle Container */}
        <div className={`bundle-container ${isExiting ? 'rolling-up' : ''}`}>

          {/* Stack Layers */}
          <div className="bundle-layer layer-3"></div>
          <div className="bundle-layer layer-2"></div>
          <div className="bundle-layer layer-1">
             <div className="newsprint-peek-top">
                <div className="newsprint-header-text">The Wedding Times</div>
                <div className="newsprint-lines"></div>
             </div>
             <div className="newsprint-peek-bottom">
                <div className="newsprint-lines"></div>
             </div>
          </div>

          {/* FLIPPING BELLY BAND CARD */}
          <div className={`belly-band-container ${stage === 'unlocked' ? 'flipped' : ''}`}>
            
            {/* FRONT FACE (The "Cover") */}
            <div className="band-face band-front" onClick={handleUntie}>
              <div className="band-content">
                <div className="band-header">OFFICIAL WEDDING INVITATION</div>
                <div className="band-names">Aditya & Chhaya</div>
                <div className="band-date">SATURDAY, MARCH 15, 2025</div>
                <div className="band-cta">
                  <span className="cta-bracket">[</span> CLICK TO UNTIE <span className="cta-bracket">]</span>
                </div>
              </div>
            </div>

            {/* BACK FACE (Detailed Invitation) */}
            <div className="band-face band-back" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}card.png)` }}>
              {/* Decorative corner flourishes */}
              <div className="corner-flourish top-left"></div>
              <div className="corner-flourish top-right"></div>
              <div className="corner-flourish bottom-left"></div>
              <div className="corner-flourish bottom-right"></div>
              
              <div className="band-content-back">
                {/* Formal header with arc styling */}
                <div className="invitation-formal-header">You are cordially invited to celebrate</div>
                
                {/* Monogram */}
                <div className="monogram-shield">
                  <span className="monogram-letter">A</span>
                  <span className="monogram-divider"></span>
                  <span className="monogram-letter">C</span>
                </div>
                
                {/* Names in elegant script - matching front */}
                <div className="band-names-back">Aditya & Chhaya</div>
                
                {/* Decorative divider */}
                <div className="elegant-divider">
                  <span className="divider-ornament">✦</span>
                </div>
                
                {/* Mandap Text replaced image */}
                <div className="mandap-text">Wedding Mandap</div>
                
                {/* Date with elegant framing */}
                <div className="invitation-date-frame">
                  <div className="date-ornament-line"></div>
                  <div className="invitation-date-large">Saturday, March 15, 2025</div>
                  <div className="date-ornament-line"></div>
                </div>
                
                {/* Venue details */}
                <div className="invitation-details-grid">
                  <div className="event-block">
                    <div className="event-label">Ceremony</div>
                    <div className="event-location">BAPS Shri Swaminarayan Mandir</div>
                    <div className="event-address">Chino Hills, California</div>
                  </div>
                  
                  <div className="venue-divider"></div>
                  
                  <div className="event-block">
                    <div className="event-label">Reception</div>
                    <div className="event-location">Majestic Banquet Hall</div>
                    <div className="event-address">Chino, California</div>
                  </div>
                </div>
                
                {/* Elegant action buttons */}
                <div className="invitation-actions">
                  <button className="action-btn primary" onClick={handleEnterSite}>
                    <span className="btn-bracket">[</span> Continue to The Times <span className="btn-bracket">]</span>
                  </button>
                  <button className="action-btn secondary" onClick={handleRSVP}>
                    <span className="btn-bracket">[</span> RSVP Now <span className="btn-bracket">]</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* TWINE (Only visible in locked stage, animates out) */}
          <div className={`twine-vertical-top ${stage !== 'locked' ? 'uncoiling' : ''}`}></div>
          <div className={`twine-vertical-bottom ${stage !== 'locked' ? 'uncoiling' : ''}`}></div>
          <div className={`twine-knot ${stage !== 'locked' ? 'untying' : ''}`} onClick={handleUntie}></div>

        </div>
      </div>
    </div>
  );
};

export default BundleIntro;


