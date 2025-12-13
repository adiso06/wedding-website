import React, { useState } from 'react';
import Masthead from './components/Masthead';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import BreakingNews from './components/BreakingNews';
import ContentGrid from './components/ContentGrid';
import Footer from './components/Footer';
import RSVPModal from './components/RSVPModal';
import './styles/App.css';

function App() {
  const [showRSVP, setShowRSVP] = useState(false);

  return (
    <div className="newspaper-container">
      <Masthead />
      <Navigation onRSVPClick={() => setShowRSVP(true)} />
      <Hero />
      <BreakingNews />
      <ContentGrid />
      <Footer onSubscribeClick={() => setShowRSVP(true)} />
      {showRSVP && <RSVPModal onClose={() => setShowRSVP(false)} />}
    </div>
  );
}

export default App;
