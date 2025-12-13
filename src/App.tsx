import React, { useState } from 'react';
import Masthead from './components/Masthead';
import Navigation from './components/Navigation';
import RSVPModal from './components/RSVPModal';
import ArticleModal from './components/ArticleModal';
import MiniCrossword from './components/MiniCrossword';
import FilmStrip from './components/FilmStrip';
import PhotoEssay from './components/PhotoEssay';
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
    title: 'Amazon PM and Future GI Fellow Announce Merger in Southern California',
    subtitle: 'Arora-Sood Union Set to Transform Two Families; Sources Confirm "It Has Been a Slow, Steady Bull Market"',
    author: 'The Editorial Board',
    date: 'Dec. 15, 2024',
    category: 'BREAKING NEWS',
    summary: 'In a move anticipated by close friends and family for years, Chhaya Arora, an Amazon Product Manager, and Aditya Sood, a future Gastroenterology Fellow, announce their merger.',
    content: (
      <>
        <p><strong>CHINO HILLS, Calif.</strong> — In a move anticipated by close friends and family for years, Chhaya Arora, a Senior Product Manager at Amazon, and Dr. Aditya Sood, a future Gastroenterology Fellow, announced their intention to merge operations effective March 15, 2025.</p>

        <p>The proposed merger, first discussed during an FBLA competition years ago when both parties were ostensibly focused on competitive business analysis, has been under careful negotiation ever since. Sources close to both parties report that the initial acquisition strategy was "awkward but charming," though it proved successful in the long term.</p>

        <p>"We have conducted extensive due diligence over the years," said Ms. Arora in a prepared statement. "The data suggests this partnership will yield significant returns in happiness, shared adventures, and quite possibly, excellent home-cooked meals."</p>

        <p>The merger is expected to combine Ms. Arora's expertise in product strategy and innovation with Dr. Sood's commitment to gastroenterological excellence and patient care. Industry analysts predict a strong synergy between technology and medicine, with potential expansion into joint ventures yet to be announced.</p>

        <h3>The Ratification</h3>

        <p>After years of steady partnership growth, Dr. Sood formally moved to ratify the relationship in Long Island City. The proposal took place at a carefully selected location, with Dr. Sood presenting the ring in a moment he had been planning in advance.</p>

        <p>"I was completely surprised," Ms. Arora stated in a recent interview. "I thought we were just going out for the day."</p>

        <p>The proposal was accepted immediately, with no conditions or amendments. Bystanders reported the weather was favorable, and the entire negotiation concluded successfully within minutes.</p>

        <p>"It has been a slow, steady bull market ever since we met," Dr. Sood noted, referencing their years-long partnership.</p>
      </>
    ),
  },
  {
    id: 'investigation',
    title: 'FBLA Competition Yields Unexpected Long-Term Dividends',
    subtitle: 'High school networking event results in multi-year strategic partnership',
    author: 'The Senior Political Correspondent',
    date: 'Dec. 15, 2024',
    category: 'INTERNATIONAL AFFAIRS',
    summary: 'It was a time of high stakes, nervous teenagers, and ill-fitting business attire. The FBLA competition would prove more valuable than any trophy.',
    content: (
      <>
        <p><strong>HIGH SCHOOL YEARS</strong> — It was a time of high stakes, nervous teenagers, and ill-fitting business attire. The setting was a Future Business Leaders of America (FBLA) competition, a place where most attendees were focused on networking and competitive spreadsheet analysis.</p>

        <p>But for Ms. Arora and Dr. Sood, the real acquisition was each other.</p>

        <p>"We were ostensibly there to compete," Ms. Arora recalled in a recent interview, noting that her focus was primarily on the business case presentations. "But the data suggests we were actually there to meet our future spouses."</p>

        <p>The initial meeting was, according to multiple sources, both awkward and charming—a combination that would prove to be the foundation of their partnership. While neither party took home the national trophy that day, they initiated a strategic partnership that would outlast any high school curriculum.</p>

        <h3>The Long-Term Investment</h3>

        <p>Over the ensuing years, the couple weathered the volatility of college years, medical school examinations, career changes, and geographic separations, proving that their initial valuation was correct.</p>

        <p>The relationship demonstrated consistent growth through various market conditions, including Dr. Sood's medical training and Ms. Arora's rise in the technology sector. Friends and family, many of whom had placed informal bets on the timing of an official announcement, watched as the partnership strengthened year over year.</p>

        <p>"It has been a slow, steady bull market ever since," Dr. Sood noted, employing financial terminology that would have made their FBLA advisors proud.</p>
      </>
    ),
  },
  {
    id: 'accommodations',
    title: 'Delegates to be Housed at Mission Inn; Group Rates Secured',
    subtitle: 'Infrastructure advisory issued: Personal transportation required for multi-venue celebration',
    author: 'The Logistics Committee',
    date: 'Dec. 15, 2024',
    category: 'TRAVEL & LEISURE',
    summary: 'Following extensive negotiations, favorable rates secured for attendees. Transit authorities advise rental vehicles necessary.',
    content: (
      <>
        <p><strong>CHINO HILLS, Calif.</strong> — Following extensive negotiations, accommodation packages have been secured for all attendees of the Arora-Sood merger celebration. The Logistics Committee has finalized arrangements at select Southern California establishments.</p>

        <h3>Primary Accommodation</h3>
        <ul>
          <li><strong>Primary Venue:</strong> Mission Inn</li>
          <li><strong>Location:</strong> Riverside, California</li>
          <li><strong>Booking Details:</strong> Contact hotel directly for group rate</li>
          <li><strong>Additional Hotel:</strong> To be announced</li>
        </ul>

        <h3>Transit & Infrastructure</h3>
        <p><strong>Important Advisory:</strong> The celebration will take place across multiple venues in the Chino Hills area. Delegates are strongly encouraged to secure rental vehicles for the duration of their stay. No centralized shuttle service will be provided.</p>

        <p>Recommended rental agencies operate from Los Angeles International Airport (LAX), Ontario International Airport (ONT), and John Wayne Airport (SNA). Early reservations are advised, particularly for the mid-March timeframe.</p>

        <h3>Air Travel</h3>
        <p>Wedding logistics experts recommend booking flights into one of three Southern California airports:</p>
        <ul>
          <li><strong>Ontario (ONT)</strong> - Closest to venues. Approximately 30 miles from Chino Hills.</li>
          <li><strong>Los Angeles (LAX)</strong> - Major international hub. 60 miles from celebration sites.</li>
          <li><strong>John Wayne/Orange County (SNA)</strong> - Alternative gateway. 45 miles from venues.</li>
        </ul>

        <h3>Weather Advisory</h3>
        <p>Southern California in mid-March typically features mild temperatures ranging from 60-75°F (15-24°C). However, delegates should consult current forecasts as conditions may vary. Indoor and outdoor events are scheduled.</p>
      </>
    ),
  },
  {
    id: 'schedule',
    title: 'Complete Timeline of Weekend Events Released; Baraat Assembly at 10:30 AM Sharp',
    subtitle: 'Two-day celebration schedule finalized; select guests invited to Friday festivities',
    author: 'The Events Committee',
    date: 'Dec. 15, 2024',
    category: 'THE SCHEDULE',
    summary: 'Full timeline for March 14-15, 2025 celebration. Main events Saturday; Western schedule strictly enforced.',
    content: (
      <>
        <p><strong>CHINO HILLS, Calif.</strong> — The complete schedule for the weekend of March 14-15, 2025 has been released. All times are subject to change based on meteorological conditions and the whims of extended family.</p>

        <h3>Friday, March 14th (Select Guests Only)</h3>

        <p><strong>2:00 PM - Haldi Ceremony</strong><br />
          Traditional pre-wedding ritual. Dress Code: Indian attire recommended. Duration approximately 3 hours.</p>

        <p><strong>5:00 PM - Dinner Service</strong><br />
          Meal service for Haldi attendees.</p>

        <p><strong>6:00 PM - Evening Gathering</strong><br />
          Informal celebrations continue through 9:00 PM.</p>

        <h3>Saturday, March 15th (All Guests)</h3>

        <p><strong>10:30 AM - Baraat Assembly</strong><br />
          <em>Critical Advisory:</em> The Baraat procession will mobilize at 10:30 AM sharp. While the couple respects cultural traditions regarding "Indian Standard Time," this event operates on a strict Western schedule. Delegates arriving late risk missing the procession entirely. The Events Committee cannot overstate the importance of punctuality.</p>

        <p><strong>11:00 AM - Wedding Ceremony</strong><br />
          BAPS Mandir, Chino Hills. Traditional Hindu wedding ceremony. Dress Code: Indian attire strongly preferred; formal suits acceptable. Ceremony duration approximately 2-3 hours. <strong>Important:</strong> Modest attire required for temple entry.</p>

        <p><strong>1:30 PM - Lunch Service</strong><br />
          Following ceremony at BAPS Mandir. Traditional Indian cuisine will be served.</p>

        <p><strong>6:00 PM - Reception Begins</strong><br />
          Majestic Banquet Hall, Chino Hills. Dress Code: Indo-Western fusion or Western formal attire. The committee encourages creative interpretation while maintaining elegance.</p>

        <p><strong>12:00 AM - Closing</strong><br />
          Reception concludes. Delegates responsible for their own transportation back to accommodations.</p>

        <h3>Dress Code Clarifications</h3>
        <ul>
          <li><strong>Haldi (Friday):</strong> Indian attire recommended</li>
          <li><strong>Wedding Ceremony:</strong> Indian attire strongly preferred; formal suits acceptable</li>
          <li><strong>Reception:</strong> Indo-Western or Western formal—both welcomed</li>
        </ul>

        <p><em>The committee requests guests avoid jeans and athletic wear throughout the weekend. Photos should look timeless, not chaotic.</em></p>
      </>
    ),
  },

  {
    id: 'market-analysis',
    title: 'Wedding Registry Market Shows Bullish Trends',
    subtitle: 'Analysts Predict High Yields on Cuisinart Futures',
    author: 'The Financial Desk',
    date: 'Dec. 15, 2024',
    category: 'MARKETS',
    summary: 'Investors are flocking to high-quality domestic assets. "The Le Creuset index is looking particularly strong," notes one analyst.',
    content: (
      <>
        <p><strong>NEW YORK</strong> — Financial markets opened higher today as news of the registry release sent shockwaves through the domestic goods sector.</p>
        <p>"We are seeing unprecedented demand for high-end cookware," said Jim Cramer on his evening show. "Buy, buy, buy!"</p>
      </>
    ),
  },
  {
    id: 'opinion-merger',
    title: 'Why This Merger Makes Sense',
    subtitle: 'A strategic analysis of the union',
    author: 'The Editorial Board',
    date: 'Dec. 15, 2024',
    category: 'OPINION',
    summary: 'Critics said it wouldn\'t work. They were wrong. Here is why the synergy is undeniable.',
    content: (
      <>
        <p>Many skeptics pointed to the geographic distance. Others cited the disparate industries of Tech and Medicine. But they failed to account for the most important variable: Love (and FaceTime).</p>
      </>
    ),
  },
  {
    id: 'tech-gastro',
    title: 'AI in Gastroenterology: A Dinner Table Debate',
    author: 'Tech & Health',
    date: 'Dec. 15, 2024',
    category: 'TECH',
    summary: 'When a PM meets a Doctor, the conversation inevitably turns to "optimizing the digestive workflow."',
    content: (
      <>
        <p>It started as a joke. Now, they are writing a white paper. We explore the implications of "Agile Digestion."</p>
      </>
    ),
  },
  {
    id: 'travel-guide',
    title: '36 Hours in Chino Hills',
    author: 'Travel & Leisure',
    date: 'Dec. 15, 2024',
    category: 'TRAVEL',
    summary: 'It\'s not just a suburb. It\'s a destination. Where to eat, stay, and shop.',
    content: (
      <>
        <p>Forget Paris. Chino Hills is where the action is this March. We list the top 5 boba spots you must visit.</p>
      </>
    ),
  },
  {
    id: 'style-watch',
    title: 'The Return of the Nehru Jacket',
    author: 'Fashion Week',
    date: 'Dec. 15, 2024',
    category: 'STYLE',
    summary: 'Designers say the classic look is back, just in time for the Sangeet.',
    content: (
      <>
        <p>Modest, elegant, and timeless. The Nehru jacket is making a comeback on runways from Milan to Mumbai.</p>
      </>
    ),
  },
  {
    id: 'sports-cricket',
    title: 'Groom Squad vs. Bride Squad: The Cricket Match of the Century',
    author: 'Sports Desk',
    date: 'Dec. 15, 2024',
    category: 'SPORTS',
    summary: 'Odds are 50-50 as the teams prepare for the pre-wedding showdown.',
    content: (
      <>
        <p>The trash talk has already begun in the family WhatsApp group. "They don't have the bowling depth," claims the Groom's cousin.</p>
      </>
    ),
  },
  {
    id: 'real-estate',
    title: 'Housing Market in Chino Hills Heats Up',
    author: 'Real Estate',
    date: 'Dec. 15, 2024',
    category: 'REAL ESTATE',
    summary: 'Inventory remains low as wedding guests snap up Airbnbs.',
    content: (
      <>
        <p>Local hosts are rejoicing. "I'm fully booked for March 15th," says one Superhost.</p>
      </>
    ),
  },
  {
    id: 'arts-dance',
    title: 'Choreography Leaks: Is the Groom Practicing?',
    author: 'Arts & Culture',
    date: 'Dec. 15, 2024',
    category: 'ARTS',
    summary: 'Sources say late-night rehearsals are happening. Expectations are managed.',
    content: (
      <>
        <p>A blurred video surfaced on Instagram. Is that the Groom attempting a Bhangra step? Experts remain divided.</p>
      </>
    ),
  }
];

function App() {
  const [showRSVP, setShowRSVP] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="newspaper-container">
      <Masthead onRSVPClick={() => setShowRSVP(true)} />
      <Navigation onRSVPClick={() => setShowRSVP(true)} />

      {/* Film Strip Marquee */}
      <FilmStrip />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="grid-5col">
          {/* Left Column - News List */}
          <div className="col-span-3 left-column">
            <div className="sidebar-articles">
              <article className="article-card sidebar-card" onClick={() => setSelectedArticle(articles[1])}> {/* FBLA Story */}
                <h3 className="sidebar-headline">{articles[1].title}</h3>
                <p className="article-summary-small">{articles[1].summary}</p>
                <div className="article-time">4 min read</div>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card" onClick={() => setSelectedArticle(articles[2])}> {/* Accommodations */}
                <h3 className="sidebar-headline">{articles[2].title}</h3>
                <p className="article-summary-small">{articles[2].summary}</p>
                <div className="article-time">2 min read</div>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card" onClick={() => setSelectedArticle(articles[4])}> {/* Registry/Market */}
                <h3 className="sidebar-headline">{articles[4].title}</h3>
                <p className="article-summary-small">{articles[4].summary}</p>
                <div className="article-time">3 min read</div>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card" onClick={() => setSelectedArticle(articles[10])}> {/* Real Estate */}
                <div className="kicker-small">{articles[10].category}</div>
                <h3 className="sidebar-headline">{articles[10].title}</h3>
                <p className="article-summary-small">{articles[10].summary}</p>
              </article>
            </div>
          </div>

          {/* Center Column - Main Story */}
          <article
            className="article-card col-span-6 main-story"
            onClick={() => setSelectedArticle(articles[0])}
          >
            <div className="kicker-center">OFFICIAL WEDDING INVITATION</div>
            <h1 className="article-headline">{articles[0].title}</h1>
            <h2 className="article-subheadline">{articles[0].subtitle}</h2>

            <div className="article-image-container">
              <img src="/A&C-105.jpg" alt="The happy couple" className="article-image" />
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
            <div className="sidebar-header">OPINION</div>
            <div className="sidebar-articles">
              <article className="article-card sidebar-card opinion-card" onClick={() => setSelectedArticle(articles[5])}>
                <div className="opinion-author-image"></div>
                <h3 className="sidebar-headline italic">{articles[5].title}</h3>
                <div className="article-byline">By {articles[5].author}</div>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card opinion-card" onClick={() => setSelectedArticle(articles[3])}> {/* Schedule/Events moved here potentially or referenced */}
                <h3 className="sidebar-headline italic">The Schedule: A Western Timeframe for an Eastern Event</h3>
                <div className="article-byline">By The Events Committee</div>
              </article>

              <div className="divider-line double"></div>

              <div className="sidebar-header">LIFE & ARTS</div>

              <article className="article-card sidebar-card" onClick={() => setSelectedArticle(articles[7])}> {/* Travel */}
                <div className="article-category">{articles[7].category}</div>
                <h3 className="sidebar-headline">{articles[7].title}</h3>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card" onClick={() => setSelectedArticle(articles[8])}> {/* Style */}
                <div className="article-category">{articles[8].category}</div>
                <h3 className="sidebar-headline">{articles[8].title}</h3>
              </article>

              <div className="divider-line"></div>

              <article className="article-card sidebar-card" onClick={() => setSelectedArticle(articles[11])}> {/* Arts */}
                <div className="article-category">{articles[11].category}</div>
                <h3 className="sidebar-headline">{articles[11].title}</h3>
              </article>
            </div>
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

      {/* Interactive Photo Essay */}
      <PhotoEssay />

      {/* Registry Section */}
      <section className="registry-section border-top">
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

        <div className="quote-section border-top-double">
          <div className="quote-container">
            <span className="quote-label">Quote of the Day:</span>
            <span className="quote-text">"I knew it was a bull market when she agreed to the second date." — Aditya Sood, on the early days of the merger.</span>
          </div>
        </div>
      </section >

      {/* Modals */}
      {showRSVP && <RSVPModal onClose={() => setShowRSVP(false)} />}
      {
        selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )
      }
    </div >
  );
}

export default App;
