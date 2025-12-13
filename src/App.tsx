import React, { useState } from 'react';
import Masthead from './components/Masthead';
import Navigation from './components/Navigation';
import RSVPModal from './components/RSVPModal';
import ArticleModal from './components/ArticleModal';
import MiniCrossword from './components/MiniCrossword';
import './styles/App.css';

// Article data
interface Article {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  date: string;
  content: React.ReactNode;
  category?: string;
  summary: string;
}

const articles: Article[] = [
  {
    id: 'merger',
    title: 'Long-Awaited Merger Finalized in Napa Valley',
    subtitle: 'Thompson-Anderson Union Set to Transform Two Families; Sources Confirm "Unprecedented Levels of Joy"',
    author: 'The Editorial Board',
    date: 'Jan. 15, 2024',
    category: 'BREAKING NEWS',
    summary: 'In what industry insiders are calling "the union of the century," Sarah Thompson and James Anderson announce their merger.',
    content: (
      <>
        <p><strong>NAPA VALLEY, Calif.</strong> — In what industry insiders are calling "the union of the century," Sarah Elizabeth Thompson, 29, of San Francisco, and James Michael Anderson, 31, of Oakland, announced their intention to merge operations effective October 12, 2024.</p>

        <p>The proposed merger, first discussed over craft cocktails at a North Beach establishment in March 2021, has been under careful negotiation ever since. Sources close to both parties report that the deal was sealed during a weekend retreat in Mendocino, when Mr. Anderson presented a comprehensive proposal that Ms. Thompson found "completely irresistible."</p>

        <p>"We have conducted extensive due diligence," said Ms. Thompson in a prepared statement, "and we are confident that this partnership will yield significant returns in happiness, adventure, and possibly golden retrievers."</p>

        <p>The merger is expected to combine the Thompson family's renowned expertise in sustainable architecture with the Anderson family's long-standing tradition of artisanal coffee roasting and dad jokes.</p>

        <h3>The Proposal</h3>

        <p>Fast forward to September 2023. Mr. Anderson had been planning for months. He knew Sarah loved the coast, particularly the rugged beauty of Mendocino. He booked a weekend at a cliffside inn, arranged for a private dinner on the terrace, and carried the ring in his pocket for two days, waiting for the perfect moment.</p>

        <p>It came during a sunset walk along the headlands. As the sky turned brilliant shades of orange and pink, he stopped, took her hands, and delivered a speech he'd been rehearsing for weeks.</p>

        <p>"I completely forgot everything I planned to say," Mr. Anderson admitted. "But it didn't matter. She said yes before I even got the ring out of my pocket."</p>
      </>
    ),
  },
  {
    id: 'investigation',
    title: 'An Investigation into the First Date: Sources Allege Instant Chemistry',
    subtitle: 'Eyewitnesses report "disgustingly cute" behavior at North Beach establishment',
    author: 'Special Investigative Report',
    date: 'Jan. 15, 2024',
    category: 'SPECIAL REPORT',
    summary: 'On a cool evening in March 2021, two individuals entered a dimly lit bar, unaware their lives were about to change forever.',
    content: (
      <>
        <p><strong>SAN FRANCISCO</strong> — On a cool evening in March 2021, two individuals entered a dimly lit North Beach establishment, unaware that their lives were about to change forever. What transpired over the next three hours has been described by witnesses as "magical," "inevitable," and "disgustingly cute."</p>

        <p>Sarah Thompson, then 27, was skeptical. After a series of disappointing dating app encounters, she had nearly given up on finding someone who shared her passion for terrible puns and early-morning hikes. James Anderson, 29, was equally wary, having recently sworn off online dating entirely.</p>

        <p>But their mutual friend, Rachel Martinez, was convinced they were perfect for each other. "I knew within five minutes of meeting each of them," Ms. Martinez testified. "Same weird sense of humor. Same values. Same inability to resist a good bookstore."</p>

        <p>The setup worked. Over craft cocktails and shared appetizers, the conversation flowed effortlessly. When the bar closed, they continued talking on a bench in Washington Square Park until nearly 2 AM.</p>

        <p>"I remember thinking, 'This is either going to be the best relationship of my life or the most devastating heartbreak,'" Ms. Thompson recalled in a recent interview. "Fortunately, it was the former."</p>
      </>
    ),
  },
  {
    id: 'accommodations',
    title: 'Delegates to be Housed at Silverado Resort; Treaty Signed for Group Rate',
    subtitle: 'Comprehensive accommodation package secured for October celebration',
    author: 'The Logistics Committee',
    date: 'Jan. 15, 2024',
    category: 'TRAVEL',
    summary: 'Following extensive negotiations, favorable rates secured at historic Silverado Resort & Spa.',
    content: (
      <>
        <p><strong>NAPA, Calif.</strong> — Following extensive negotiations, a comprehensive accommodation package has been secured at the historic Silverado Resort & Spa. The agreement, finalized in late 2023, ensures favorable rates for all attendees of the Thompson-Anderson merger celebration.</p>

        <h3>Accommodation Details</h3>
        <ul>
          <li><strong>Venue:</strong> Silverado Resort & Spa</li>
          <li><strong>Address:</strong> 1600 Atlas Peak Road, Napa, CA 94558</li>
          <li><strong>Rate:</strong> $285/night (King or Double Queen)</li>
          <li><strong>Booking Code:</strong> THOMPSON-ANDERSON2024</li>
          <li><strong>Deadline:</strong> September 12, 2024</li>
          <li><strong>Phone:</strong> (707) 257-0200</li>
        </ul>

        <p>The property features two championship golf courses, multiple pools, and award-winning dining facilities. Complimentary shuttle service to the ceremony venue will be provided.</p>

        <h3>Air Travel</h3>
        <p>Wedding logistics experts recommend booking flights into one of three major Bay Area airports:</p>
        <ul>
          <li><strong>San Francisco (SFO)</strong> - Primary gateway. 60 miles from Napa Valley.</li>
          <li><strong>Oakland (OAK)</strong> - Alternative hub. 55 miles from venue. Often more economical.</li>
          <li><strong>Sacramento (SMF)</strong> - Regional option. 65 miles from Napa. Smaller crowds.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'schedule',
    title: 'Complete Timeline of Saturday\'s Events Released',
    subtitle: 'Ceremony begins 3:30 PM sharp; guests advised to arrive early',
    author: 'The Events Committee',
    date: 'Jan. 15, 2024',
    category: 'SCHEDULE',
    summary: 'Full timeline for October 12th celebration, from ceremony through final shuttles.',
    content: (
      <>
        <p><strong>NAPA VALLEY, Calif.</strong> — The complete schedule for Saturday, October 12, 2024 has been released. All times are subject to change based on meteorological conditions and champagne availability.</p>

        <h3>3:30 PM - Ceremony Begins</h3>
        <p>Garden Terrace, Silverado Resort. Guests should be seated by 3:20 PM. The ceremony will last approximately 30 minutes.</p>

        <h3>4:15 PM - Cocktail Hour</h3>
        <p>North Lawn. Wine tasting, hors d'oeuvres, and live jazz ensemble. Guests are encouraged to mingle and explore the grounds.</p>

        <h3>5:30 PM - Reception & Dinner</h3>
        <p>Grand Ballroom. Plated dinner service begins, followed by toasts and revelry.</p>

        <h3>7:00 PM - First Dance</h3>
        <p>Grand Ballroom. The newlyweds' first dance, followed by an open dance floor for all guests.</p>

        <h3>9:30 PM - Cake Cutting</h3>
        <p>Grand Ballroom. Traditional cake cutting ceremony, followed by dessert service.</p>

        <h3>11:00 PM - Last Call</h3>
        <p>Grand Ballroom. Final drinks served. Shuttles to hotels depart at 11:30 PM.</p>
      </>
    ),
  },
];

function App() {
  const [showRSVP, setShowRSVP] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="newspaper-container">
      <Masthead onRSVPClick={() => setShowRSVP(true)} />
      <Navigation onRSVPClick={() => setShowRSVP(true)} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="grid-5col">
          {/* Main Story */}
          <article
            className="article-card col-span-8"
            onClick={() => setSelectedArticle(articles[0])}
          >
            <div className="article-category">{articles[0].category}</div>
            <h1 className="article-headline">{articles[0].title}</h1>
            <h2 className="article-subheadline">{articles[0].subtitle}</h2>
            <div className="article-image-placeholder"></div>
            <p className="article-summary">{articles[0].summary}</p>
            <div className="article-byline">By {articles[0].author}</div>
          </article>

          {/* Sidebar Articles */}
          <div className="col-span-4 sidebar-articles">
            <article
              className="article-card sidebar-card"
              onClick={() => setSelectedArticle(articles[1])}
            >
              <div className="article-category">{articles[1].category}</div>
              <h3 className="sidebar-headline">{articles[1].title}</h3>
              <p className="article-summary-small">{articles[1].summary}</p>
            </article>

            <article
              className="article-card sidebar-card border-top"
              onClick={() => setSelectedArticle(articles[2])}
            >
              <div className="article-category">{articles[2].category}</div>
              <h3 className="sidebar-headline">{articles[2].title}</h3>
              <p className="article-summary-small">{articles[2].summary}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Secondary Stories */}
      <section className="secondary-section">
        <div className="grid-5col">
          <article
            className="article-card col-span-6"
            onClick={() => setSelectedArticle(articles[3])}
          >
            <div className="article-category">{articles[3].category}</div>
            <h3 className="article-headline-secondary">{articles[3].title}</h3>
            <p className="article-summary">{articles[3].summary}</p>
            <div className="article-byline">By {articles[3].author}</div>
          </article>

          {/* Games Section */}
          <div className="col-span-6">
            <MiniCrossword />
          </div>
        </div>
      </section>

      {/* Registry Section */}
      <section className="registry-section border-top">
        <div className="grid-5col">
          <div className="col-span-12">
            <h3 className="section-title">Registry</h3>
            <div className="registry-grid">
              <a href="#" className="registry-card">
                <h4>Crate & Barrel</h4>
                <p>For the home we're building together</p>
              </a>
              <a href="#" className="registry-card">
                <h4>Williams Sonoma</h4>
                <p>Culinary essentials</p>
              </a>
              <a href="#" className="registry-card">
                <h4>Honeymoon Fund</h4>
                <p>Adventures in Japan, 2025</p>
              </a>
              <a href="#" className="registry-card">
                <h4>Charity: Water</h4>
                <p>Clean water for communities</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showRSVP && <RSVPModal onClose={() => setShowRSVP(false)} />}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}

export default App;
