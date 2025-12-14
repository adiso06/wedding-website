import React from 'react';
import './RSVPModal.css';

interface RSVPModalProps {
  onClose: () => void;
}

const RSVPModal: React.FC<RSVPModalProps> = ({ onClose }) => {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Trap focus in modal
  React.useEffect(() => {
    const modalElement = document.querySelector('.modal-content');
    if (modalElement) {
      const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      window.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => window.removeEventListener('keydown', handleTab);
    }
  }, []);

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content paywall-modal" onClick={(e) => e.stopPropagation()}>

        <button
          onClick={onClose}
          className="modal-close"
          aria-label="Close RSVP modal"
        >
          ✕
        </button>

        <div className="paywall-header">
          <h2 id="modal-title" className="paywall-title">
            You Have Reached Your Limit of Free Articles
          </h2>
          <p className="paywall-subtitle">
            To continue reading regarding the Wedding of Chhaya & Aditya,
            attendance is mandatory.
          </p>
        </div>

        <div className="paywall-features">
          <ul className="feature-list">
            <li className="feature-item">
              <span className="checkmark">✓</span> Unlimited access to Open Bar
            </li>
            <li className="feature-item">
              <span className="checkmark">✓</span> Exclusive interview with the Groom
            </li>
            <li className="feature-item">
              <span className="checkmark">✓</span> 7-Course Dining Experience
            </li>
          </ul>
        </div>

        <div className="paywall-action">
          {/* THIS IS THE CONNECTION TO JOY */}
          <a
            href="https://withjoy.com/chhaya-arora-and-aditya/rsvp?joyHotelDiscountCode=JOY5"
            target="_blank"
            rel="noopener noreferrer"
            className="subscribe-button"
          >
            Subscribe (RSVP)
          </a>
          <p className="paywall-footer">
            Redirects to our secure partner, WithJoy.com
            <span className="access-code">Access Code: RSVP</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RSVPModal;
