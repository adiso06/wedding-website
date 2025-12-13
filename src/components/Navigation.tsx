import React from 'react';
import './Navigation.css';

interface NavigationProps {
  onRSVPClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onRSVPClick }) => {
  return (
    <nav className="navigation border-bottom">
      <div className="nav-container">
        <div className="nav-sections">
          <a href="#" className="nav-link">Our Story</a>
          <a href="#" className="nav-link">Schedule</a>
          <a href="#" className="nav-link">Travel</a>
          <a href="#" className="nav-link">Registry</a>
          <a href="#" className="nav-link">Games</a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
