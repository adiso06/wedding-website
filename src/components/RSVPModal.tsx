import React from 'react';
import './RSVPModal.css';

interface RSVPModalProps {
  onClose: () => void;
}

const RSVPModal: React.FC<RSVPModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content paywall-modal" onClick={(e) => e.stopPropagation()}>

        <button
          onClick={onClose}
          className="modal-close"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="paywall-header">
          <h2 className="paywall-title">
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
              <span className="checkmark">✓</span> 3-Course Dining Experience
            </li>
          </ul>
        </div>

        <div className="paywall-action">
          {/* THIS IS THE CONNECTION TO JOY */}
          <a
            href="https://withjoy.com/[YOUR-URL-HANDLE]/rsvp"
            target="_blank"
            rel="noopener noreferrer"
            className="subscribe-button"
          >
            Subscribe (RSVP)
          </a>
          <p className="paywall-footer">
            Redirects to our secure partner, WithJoy.com
            <span className="access-code">Access Code: [YOUR_PASSWORD]</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RSVPModal;
