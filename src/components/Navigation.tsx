import React from 'react';
import './Navigation.css';

interface NavigationProps {
  onRSVPClick: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenInfoPage: (page: 'ceremony' | 'reception' | 'accommodations' | 'registry') => void;
  onOpenArticle: (articleId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onRSVPClick, onNavigate, onOpenInfoPage, onOpenArticle }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    onNavigate(sectionId);
  };

  return (
    <nav className="navigation border-bottom" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <div className="nav-sections">
          <a
            href="#the-couple"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onOpenArticle('investigation');
            }}
            aria-label="About the couple"
          >
            THE COUPLE
          </a>
          <a 
            href="#ceremony" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onOpenInfoPage('ceremony');
            }}
            aria-label="Ceremony details"
          >
            THE CEREMONY
          </a>
          <a 
            href="#reception" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onOpenInfoPage('reception');
            }}
            aria-label="Reception information"
          >
            RECEPTION
          </a>
          <a 
            href="#accommodations" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onOpenInfoPage('accommodations');
            }}
            aria-label="View accommodations"
          >
            ACCOMMODATIONS
          </a>
          <a 
            href="#registry" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onOpenInfoPage('registry');
            }}
            aria-label="View registry"
          >
            REGISTRY
          </a>
          <a
            href="#our-story"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onOpenArticle('merger');
            }}
            aria-label="Read our story"
          >
            OUR STORY
          </a>
          <a
            href="https://www.theknot.com/us/chhaya-arora-and-aditya-sood-mar-2026/rsvp"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link rsvp-button"
            aria-label="RSVP for the wedding"
          >
            RSVP
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
