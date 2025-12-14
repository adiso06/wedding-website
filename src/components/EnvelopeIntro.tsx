import { useState, ReactNode } from 'react';
import './EnvelopeIntro.css';

interface EnvelopeIntroProps {
  children: ReactNode;
}

const EnvelopeIntro = ({ children }: EnvelopeIntroProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Handle the "Open" animation timing
  const handleOpen = () => {
    setIsOpen(true);
    // Wait for animation to finish (1.5s) before removing from DOM
    setTimeout(() => {
      setIsHidden(true);
    }, 1500);
  };

  if (isHidden) {
    return <>{children}</>;
  }

  return (
    <div className="envelope-wrapper">
      {/* This is the "Real" website underneath */}
      <div className={`envelope-content ${isOpen ? 'visible' : 'hidden'}`}>
        {children}
      </div>

      {/* THE ENVELOPE OVERLAY */}
      <div className={`envelope-overlay ${isOpen ? 'opening' : ''}`}>
        
        {/* The Envelope Container */}
        <div onClick={handleOpen} className="envelope-container">

          {/* Bottom Flap (Pocket) */}
          <div className="envelope-flap-bottom"></div>

          {/* Left Flap */}
          <div className="envelope-flap-left"></div>

          {/* Right Flap */}
          <div className="envelope-flap-right"></div>

          {/* Top Flap (The part that opens) */}
          <div className={`envelope-flap-top ${isOpen ? 'opening' : ''}`}>
            
            {/* The Wax Seal - Centered on the tip of the top flap */}
            <div className={`wax-seal-container ${isOpen ? 'hidden' : ''}`}>
              
              {/* Wax Seal Graphic (CSS Circle) */}
              <div className="wax-seal">
                {/* Inner Ring */}
                <div className="wax-seal-inner">
                  <span className="wax-seal-text">
                    C<span className="ampersand">&</span>A
                  </span>
                </div>
              </div>

              {/* Text Prompts */}
              <div className="invitation-text">
                <p className="invitation-subtitle">
                  Invitation to the Union of
                </p>
                <p className="invitation-names">
                  Aditya & Chhaya
                </p>
                <p className="tap-prompt">
                  [ Tap to Open ]
                </p>
              </div>

            </div>
          </div>

          {/* The "Newspaper" Inside (Preview) */}
          <div className={`newspaper-preview ${isOpen ? 'sliding' : ''}`}>
            <div className="newspaper-content">
              <h1 className="newspaper-title">The Arora-Sood Times</h1>
              <div className="newspaper-divider"></div>
              <div className="newspaper-grid">
                <div className="newspaper-block large"></div>
                <div className="newspaper-block"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnvelopeIntro;
