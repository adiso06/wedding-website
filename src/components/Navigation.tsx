import React from 'react';
import './Navigation.css';

interface NavigationProps {
  onRSVPClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onRSVPClick }) => {
  const sections = [
    'Our Story',
    'Logistics',
    'Accommodations',
    'Registry',
    'The Party',
  ];

  return (
    <nav className="navigation border-bottom">
      <div className="nav-sections">
        {sections.map((section) => (
          <a
            key={section}
            href={`#${section.toLowerCase().replace(' ', '-')}`}
            className="nav-link"
          >
            {section}
          </a>
        ))}
        <button onClick={onRSVPClick} className="nav-link nav-rsvp">
          RSVP
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
