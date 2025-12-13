import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero grid-5col">
      {/* Lead story - 3 columns */}
      <article className="hero-lead col-span-3 border-right">
        <div className="hero-lead-content">
          <div className="section-label">BREAKING NEWS</div>
          <h1 className="hero-headline">
            LONG-AWAITED MERGER FINALIZED IN NAPA VALLEY
          </h1>
          <h2 className="hero-subheadline">
            Thompson-Anderson Union Set to Transform Two Families;
            Sources Confirm "Unprecedented Levels of Joy"
          </h2>

          <div className="hero-image-wrapper">
            <div className="hero-image-placeholder">
              {/* Placeholder for couple's photo */}
              <div className="image-credit">PHOTO: STUDIO PORTRAIT, 2024</div>
            </div>
            <p className="caption">
              Sarah Thompson and James Anderson photographed at their engagement
              session in Golden Gate Park. The couple's merger, anticipated by
              close sources for over three years, will be finalized October 12, 2024.
            </p>
          </div>

          <div className="hero-story">
            <p className="byline">By The Editorial Board</p>
            <p className="dateline">Published Jan. 15, 2024 | Updated daily</p>

            <p>
              <strong>NAPA VALLEY, Calif.</strong> — In what industry insiders are calling
              "the union of the century," Sarah Elizabeth Thompson, 29, of San Francisco,
              and James Michael Anderson, 31, of Oakland, announced their intention to
              merge operations effective October 12, 2024.
            </p>

            <p>
              The proposed merger, first discussed over craft cocktails at a North Beach
              establishment in March 2021, has been under careful negotiation ever since.
              Sources close to both parties report that the deal was sealed during a
              weekend retreat in Mendocino, when Mr. Anderson presented a comprehensive
              proposal that Ms. Thompson found "completely irresistible."
            </p>

            <p>
              "We have conducted extensive due diligence," said Ms. Thompson in a
              prepared statement, "and we are confident that this partnership will yield
              significant returns in happiness, adventure, and possibly golden retrievers."
            </p>

            <p>
              The merger is expected to combine the Thompson family's renowned expertise
              in sustainable architecture with the Anderson family's long-standing
              tradition of artisanal coffee roasting and dad jokes.
            </p>
          </div>
        </div>
      </article>

      {/* Sidebar - 2 columns */}
      <aside className="hero-sidebar col-span-2">
        <div className="sidebar-section border-bottom">
          <h5 className="sidebar-title">OPINION</h5>
          <div className="sidebar-content">
            <article className="sidebar-article">
              <h4 className="sidebar-headline">
                "We Knew It From Day One"
              </h4>
              <p className="byline">By Margaret Thompson, Mother of the Bride</p>
              <p>
                When Sarah called to tell me about James, I could hear it in her voice.
                This wasn't just another date — this was the real deal. And I was right.
              </p>
            </article>
          </div>
        </div>

        <div className="sidebar-section border-bottom">
          <div className="sidebar-content">
            <article className="sidebar-article">
              <h4 className="sidebar-headline">
                "A Brother's Perspective on Letting Go"
              </h4>
              <p className="byline">By Robert Anderson, Best Man</p>
              <p>
                I've known James my whole life, and I've never seen him happier.
                Sarah brings out the best in him. Still, she should know: he's
                terrible at miniature golf.
              </p>
            </article>
          </div>
        </div>

        <div className="sidebar-section">
          <h5 className="sidebar-title">THE VOWS</h5>
          <div className="sidebar-content quote-box">
            <blockquote>
              "In a world of uncertainty, you are my constant. In a sea of choices,
              you are my only answer. In all the days to come, you are my forever."
            </blockquote>
            <cite>— From their engagement letters</cite>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default Hero;
