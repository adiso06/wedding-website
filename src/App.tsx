import { useState, useEffect, useRef } from 'react';
import Masthead from './components/Masthead';
import Navigation from './components/Navigation';
import BreakingNews from './components/BreakingNews';
import RSVPModal from './components/RSVPModal';
import ArticleModal from './components/ArticleModal';
import CeremonyPage from './components/CeremonyPage';
import ReceptionPage from './components/ReceptionPage';
import AccommodationsPage from './components/AccommodationsPage';
import RegistryPage from './components/RegistryPage';
import MiniCrossword from './components/MiniCrossword';
import FilmStrip from './components/FilmStrip';
import PhotoEssay from './components/PhotoEssay';
import { articles, type Article } from './data/articles';
import './styles/App.css';

type InfoPageType = 'ceremony' | 'reception' | 'accommodations' | 'registry' | null;

// Tracking thresholds for subscriber nudge
const BANNER_THRESHOLD = 2; // Show banner after 2 articles
const ARTICLE_PAYWALL_THRESHOLD = 3; // Show article paywall after 3 articles
const TIME_THRESHOLD = 45; // Show after 45 seconds on site
const SCROLL_THRESHOLD = 800; // Show after scrolling 800px down

function App() {
  const [showRSVP, setShowRSVP] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeInfoPage, setActiveInfoPage] = useState<InfoPageType>(null);
  const [showBannerNudge, setShowBannerNudge] = useState(false);
  const [showScrollPaywall, setShowScrollPaywall] = useState(false);
  const [showArticlePaywall, setShowArticlePaywall] = useState(false);
  const [articleViewCount, setArticleViewCount] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const scrollPaywallDismissedRef = useRef<boolean>(false);
  const articlePaywallDismissedRef = useRef<boolean>(false);

  // Initialize tracking - session-based only (resets on page load)
  useEffect(() => {
    // Clear any old localStorage tracking
    localStorage.removeItem('hasRSVPd');
    localStorage.removeItem('articleViewCount');
    console.log('🔄 Tracking reset - fresh session started');
  }, []);

  // Track time on site for banner
  useEffect(() => {
    if (showBannerNudge) {
      return;
    }

    const timeCheckInterval = setInterval(() => {
      const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
      
      if (timeElapsed >= TIME_THRESHOLD) {
        setShowBannerNudge(true);
        clearInterval(timeCheckInterval);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(timeCheckInterval);
  }, [showBannerNudge]);

  // Check if we should show banner based on article views
  useEffect(() => {
    if (showBannerNudge) {
      return;
    }

    if (articleViewCount >= BANNER_THRESHOLD) {
      setShowBannerNudge(true);
    }
  }, [articleViewCount, showBannerNudge]);

  // Check if we should show article paywall based on article views
  useEffect(() => {
    if (articlePaywallDismissedRef.current) {
      console.log('🚫 Paywall blocked: Paywall dismissed in this session');
      return;
    }

    if (articleViewCount >= ARTICLE_PAYWALL_THRESHOLD) {
      console.log('✅ Setting article paywall to TRUE');
      setShowArticlePaywall(true);
    }
  }, [articleViewCount]);

  // Track scroll position for scroll-based paywall
  useEffect(() => {
    const handleScroll = () => {
      if (scrollPaywallDismissedRef.current) {
        return;
      }

      const scrollPosition = window.scrollY || window.pageYOffset;
      
      if (scrollPosition >= SCROLL_THRESHOLD && !showScrollPaywall) {
        setShowScrollPaywall(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollPaywall]);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Open specific article with tracking
  const openArticle = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (article) {
      setSelectedArticle(article);
      
      // Track article view (session only - no localStorage persistence)
      const newCount = articleViewCount + 1;
      setArticleViewCount(newCount);
      
      // Debug logging
      console.log(`📰 Article opened: ${article.title}`);
      console.log(`📊 Total articles viewed: ${newCount} (session only)`);
      console.log(`🚪 Paywall threshold: ${ARTICLE_PAYWALL_THRESHOLD}`);
      if (newCount >= ARTICLE_PAYWALL_THRESHOLD) {
        console.log('🔒 Article paywall should trigger!');
      }
    }
  };

  // Open info page
  const openInfoPage = (page: InfoPageType) => {
    setActiveInfoPage(page);
  };

  // Handle RSVP open and mark as subscribed
  const handleRSVPOpen = () => {
    setShowRSVP(true);
    setShowBannerNudge(false);
    setShowScrollPaywall(false);
    setShowArticlePaywall(false);
  };

  // Handle RSVP close
  const handleRSVPClose = () => {
    setShowRSVP(false);
    // Hide all paywalls for this session
    setShowBannerNudge(false);
    setShowScrollPaywall(false);
    setShowArticlePaywall(false);
    console.log('✅ RSVP modal closed - paywalls hidden for this session');
  };

  // Dismiss banner nudge temporarily
  const handleDismissBanner = () => {
    setShowBannerNudge(false);
    // Reset the timer
    startTimeRef.current = Date.now();
  };

  // Dismiss scroll paywall
  const handleDismissScrollPaywall = () => {
    setShowScrollPaywall(false);
    scrollPaywallDismissedRef.current = true;
  };

  // Dismiss article paywall
  const handleDismissArticlePaywall = () => {
    setShowArticlePaywall(false);
    articlePaywallDismissedRef.current = true;
  };

  return (
    <div className="newspaper-container">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Masthead onRSVPClick={handleRSVPOpen} />
      <Navigation 
        onRSVPClick={handleRSVPOpen}
        onNavigate={scrollToSection}
        onOpenInfoPage={openInfoPage}
      />

      {/* Breaking News Banner */}
      <BreakingNews />

      {/* Banner Nudge */}
      {showBannerNudge && !showRSVP && (
        <div className="subscriber-nudge-banner">
          <div className="subscriber-nudge-content">
            <div className="subscriber-nudge-text">
              <strong>📰 Enjoying the Coverage?</strong>
              <p>RSVP to unlock unlimited access to all wedding content and confirm your attendance.</p>
            </div>
            <div className="subscriber-nudge-actions">
              <button className="subscribe-now-btn" onClick={handleRSVPOpen}>
                RSVP Now →
              </button>
              <button className="dismiss-nudge-btn" onClick={handleDismissBanner}>
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll Paywall - slides up from bottom */}
      {showScrollPaywall && !showRSVP && (
        <div className="scroll-paywall">
          <button 
            className="scroll-paywall-close"
            onClick={handleDismissScrollPaywall}
            aria-label="Dismiss"
          >
            ✕
          </button>
          <div className="scroll-paywall-content">
            <div className="scroll-paywall-icon">💍</div>
            <h3 className="scroll-paywall-title">Join Us for the Celebration</h3>
            <p className="scroll-paywall-message">
              You're reading about our special day — why not be part of it? 
              RSVP now to confirm your attendance and get full access to all event details.
            </p>
            <button className="scroll-paywall-cta" onClick={handleRSVPOpen}>
              RSVP to the Wedding
            </button>
            <p className="scroll-paywall-note">Free • Takes 2 minutes • Unlock full access</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main id="main-content">
      <section id="our-story" className="hero-section">
        <div className="grid-5col">
          {/* Left Column - News List */}
          <div className="col-span-3 left-column">
            <div className="sidebar-articles">
              <article className="article-card sidebar-card" onClick={() => openArticle(articles[1].id)}> {/* FBLA Story */}
                <h3 className="sidebar-headline">{articles[1].title}</h3>
                <p className="article-summary-small">{articles[1].summary}</p>
                <div className="article-time">4 min read</div>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card" onClick={() => openArticle(articles[3].id)}> {/* Accommodations */}
                <h3 className="sidebar-headline">{articles[3].title}</h3>
                <p className="article-summary-small">{articles[3].summary}</p>
                <div className="article-time">2 min read</div>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card" onClick={() => openArticle(articles[5].id)}> {/* Registry/Market */}
                <h3 className="sidebar-headline">{articles[5].title}</h3>
                <p className="article-summary-small">{articles[5].summary}</p>
                <div className="article-time">3 min read</div>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card" onClick={() => openArticle(articles[11].id)}> {/* Real Estate */}
                <div className="kicker-small">{articles[11].category}</div>
                <h3 className="sidebar-headline">{articles[11].title}</h3>
                <p className="article-summary-small">{articles[11].summary}</p>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card" onClick={() => openArticle(articles[13].id)}> {/* Medicine */}
                <div className="kicker-small">{articles[13].category}</div>
                <h3 className="sidebar-headline">{articles[13].title}</h3>
                <p className="article-summary-small">{articles[13].summary}</p>
              </article>
            </div>
          </div>

          {/* Center Column - Main Story */}
          <article
            className="article-card col-span-6 main-story"
            onClick={() => openArticle(articles[0].id)}
          >
            <div className="kicker-center">OFFICIAL WEDDING INVITATION</div>
            <h1 className="article-headline">{articles[0].title}</h1>
            <h2 className="article-subheadline">{articles[0].subtitle}</h2>

            <div className="article-image-container">
              <img 
                src="/A&C-105-optimized.webp" 
                alt="Chhaya Arora and Aditya Sood in Long Island City shortly after their engagement" 
                className="article-image"
                width="1200"
                height="800"
                loading="eager"
                decoding="async"
              />
              <div className="article-caption">
                The couple in Long Island City shortly after the proposal. Sources say the negotiations were brief and highly successful. (Photo: The Archives)
              </div>
            </div>

            <div className="article-content-preview">
              <p className="article-summary">{articles[0].summary}</p>
            </div>
            <div className="article-byline">By {articles[0].author}</div>
          </article>

          {/* Right Column - Opinion & Lifestyle */}
          <div className="col-span-3 right-column">
            {/* Letter from the Couple */}
            <article className="article-card sidebar-card letter-card" onClick={() => openArticle(articles[2].id)}>
              <div className="article-category">LETTER FROM THE COUPLE</div>
              <h3 className="sidebar-headline">{articles[2].title}</h3>
              <div className="article-byline">By {articles[2].author}</div>
              <p className="article-summary-small">{articles[2].summary}</p>
            </article>

            <div className="divider-line"></div>

            <div className="sidebar-header">OPINION</div>
            <div className="sidebar-subtext">Perspectives on love, marriage, and the merger ahead</div>
            <div className="sidebar-articles">
              <article className="article-card sidebar-card opinion-card" onClick={() => openArticle(articles[5].id)}>
                <div className="opinion-author-image"></div>
                <h3 className="sidebar-headline italic">{articles[5].title}</h3>
                <div className="article-byline">By {articles[5].author}</div>
                <p className="article-summary-small">{articles[5].summary}</p>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card opinion-card" onClick={() => openArticle(articles[3].id)}> {/* Schedule/Events moved here potentially or referenced */}
                <h3 className="sidebar-headline italic">The Schedule: A Western Timeframe for an Eastern Event</h3>
                <div className="article-byline">By The Events Committee</div>
                <p className="article-summary-small">{articles[3].summary}</p>
              </article>

              <div className="divider-line double"></div>

              <div className="sidebar-header">LIFE & ARTS</div>
              <div className="sidebar-subtext">Culture, style, and celebration in Southern California</div>

              <article className="article-card sidebar-card" onClick={() => openArticle(articles[7].id)}> {/* Travel */}
                <div className="article-category">{articles[7].category}</div>
                <h3 className="sidebar-headline">{articles[7].title}</h3>
                <p className="article-summary-small">{articles[7].summary}</p>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card" onClick={() => openArticle(articles[8].id)}> {/* Style */}
                <div className="article-category">{articles[8].category}</div>
                <h3 className="sidebar-headline">{articles[8].title}</h3>
                <p className="article-summary-small">{articles[8].summary}</p>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card" onClick={() => openArticle(articles[11].id)}> {/* Arts */}
                <div className="article-category">{articles[11].category}</div>
                <h3 className="sidebar-headline">{articles[11].title}</h3>
                <p className="article-summary-small">{articles[11].summary}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Film Strip Marquee */}
      <FilmStrip />

      {/* Secondary Stories */}
      <section id="schedule" className="secondary-section">
        <div className="grid-5col">
          <article
            className="article-card col-span-6"
            onClick={() => openArticle(articles[3].id)}
          >
            <div className="article-category">{articles[3].category}</div>
            <h3 className="article-headline-secondary">{articles[3].title}</h3>
            <p className="article-summary">{articles[3].summary}</p>
            <div className="article-byline">By {articles[3].author}</div>
          </article>

          {/* Games Section */}
          <div id="games" className="col-span-6">
            <MiniCrossword />
          </div>
        </div>
      </section>

      {/* Interactive Photo Essay */}
      <PhotoEssay />
      
      {/* Travel Section - Hidden anchor for navigation */}
      <div id="travel" style={{ position: 'relative', top: '-80px' }}></div>

      {/* Registry Section */}
      <section id="registry" className="registry-section border-top">
        <div className="grid-5col">
          <div className="col-span-12">
            <h3 className="section-title">The Business Section: Series A Funding</h3>
            <div className="registry-notice">
              <p><strong>Notice to Investors:</strong> Your presence at our celebration is the greatest gift we could ask for. However, for those inquiring about participation in our growth strategy, we have established the following funding mechanism:</p>
            </div>
            <div className="registry-grid">
              <a href="#" className="registry-card">
                <h4>Series A Funding Round</h4>
                <p>Cash contributions to support the couple's next venture</p>
                <div className="registry-note">Secure receptacle available at reception. Digital transfers preferred for accounting purposes.</div>
              </a>
            </div>
            <p className="registry-footer"><em>A secure drop-box for cards and envelopes will be available at the Reception. Please direct questions to the couple via the RSVP form.</em></p>
          </div>
        </div>

        <div className="quote-section border-top-double" role="complementary" aria-label="Quote of the day">
          <div className="quote-container">
            <span className="quote-label">Quote of the Day:</span>
            <span className="quote-text">"I knew it was a bull market when she agreed to the second date." — Aditya Sood, on the early days of the merger.</span>
          </div>
        </div>
      </section>
      </main>

      {/* Modals */}
      {showRSVP && <RSVPModal onClose={handleRSVPClose} />}
      {
        selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            showPaywall={showArticlePaywall && !showRSVP}
            onSubscribeClick={handleRSVPOpen}
            onDismissPaywall={handleDismissArticlePaywall}
          />
        )
      }
      
      {/* Info Pages */}
      {activeInfoPage === 'ceremony' && <CeremonyPage onClose={() => setActiveInfoPage(null)} />}
      {activeInfoPage === 'reception' && <ReceptionPage onClose={() => setActiveInfoPage(null)} />}
      {activeInfoPage === 'accommodations' && <AccommodationsPage onClose={() => setActiveInfoPage(null)} />}
      {activeInfoPage === 'registry' && <RegistryPage onClose={() => setActiveInfoPage(null)} />}
    </div >
  );
}

export default App;
