import { useState, ReactNode } from 'react';
import './BundleIntro.css';

interface BundleIntroProps {
  children: ReactNode;
}

const BundleIntro = ({ children }: BundleIntroProps) => {
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
    // Open RSVP link directly
    window.open('https://www.theknot.com/us/chhaya-arora-and-aditya-sood-mar-2026/rsvp', '_blank');
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
                <div className="band-date">SUNDAY, MARCH 15, 2026</div>
                <div className="band-cta">
                  <span className="cta-bracket">[</span> CLICK TO UNTIE <span className="cta-bracket">]</span>
                </div>
              </div>
            </div>

            {/* BACK FACE (Simplified Invitation) */}
            <div className="band-face band-back">
              <div className="band-content-back">
                {/* Inner border frame */}
                <div className="inner-border-frame"></div>
                
                {/* Header */}
                <div className="invitation-header-section">
                  <div className="header-text">With joy in our hearts</div>
                  <div className="join-us-text">You are warmly invited to the wedding of</div>
                  <div className="names-cursive">Chhaya & Aditya</div>
                </div>

                {/* Date Section with borders */}
                <div className="date-section">
                  <div className="date-text">Sunday, March 15, 2026</div>
                  <div className="time-text">Bharat at 8:45 AM • Ceremony at 10:00 AM • Reception at 6:00 PM</div>
                </div>

                {/* Action Section */}
                <div className="action-section">
                  <div className="header-text">Kindly reply by January 1st, 2026</div>
                  
                  <div className="button-container">
                    <button className="invitation-btn" onClick={handleEnterSite}>
                      View Invitation
                    </button>
                    <button className="invitation-btn" onClick={handleRSVP}>
                      RSVP
                    </button>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="footer-note">
                  <span className="joke-text">(Quick turnaround, we know. It's because we procrastinated.)</span>
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



