import React from 'react';
import './ContentGrid.css';

const ContentGrid: React.FC = () => {
  return (
    <div className="content-grid">
      {/* Travel & Leisure Section */}
      <section id="logistics" className="grid-section grid-5col border-top">
        <div className="section-header col-span-5 border-bottom">
          <h3 className="section-title">TRAVEL & LEISURE</h3>
        </div>

        <article className="col-span-3 border-right section-article">
          <h4 className="article-headline">
            Delegates to be Housed at the Silverado Resort; Treaty Signed for Group Rate
          </h4>
          <p className="byline">By the Logistics Committee</p>

          <div className="article-content">
            <p>
              <strong>NAPA, Calif.</strong> — Following extensive negotiations, a comprehensive
              accommodation package has been secured at the historic Silverado Resort & Spa.
              The agreement, finalized in late 2023, ensures favorable rates for all attendees
              of the Thompson-Anderson merger celebration.
            </p>

            <div className="info-box">
              <h6>ACCOMMODATION DETAILS</h6>
              <ul>
                <li><strong>Venue:</strong> Silverado Resort & Spa</li>
                <li><strong>Address:</strong> 1600 Atlas Peak Road, Napa, CA 94558</li>
                <li><strong>Rate:</strong> $285/night (King or Double Queen)</li>
                <li><strong>Booking Code:</strong> THOMPSON-ANDERSON2024</li>
                <li><strong>Deadline:</strong> September 12, 2024</li>
                <li><strong>Phone:</strong> (707) 257-0200</li>
              </ul>
            </div>

            <p>
              The property features two championship golf courses, multiple pools, and
              award-winning dining facilities. Complimentary shuttle service to the
              ceremony venue will be provided.
            </p>
          </div>
        </article>

        <article className="col-span-2 section-article">
          <h5 className="article-subheadline">
            Air Travel Advisories Issued for October Weekend
          </h5>

          <div className="article-content">
            <p>
              Wedding logistics experts recommend booking flights into one of three
              major Bay Area airports:
            </p>

            <div className="travel-grid">
              <div className="travel-option">
                <h6>San Francisco (SFO)</h6>
                <p className="caption">
                  Primary gateway. 60 miles from Napa Valley. Rental cars and
                  shuttles available.
                </p>
              </div>

              <div className="travel-option">
                <h6>Oakland (OAK)</h6>
                <p className="caption">
                  Alternative hub. 55 miles from venue. Often more economical.
                </p>
              </div>

              <div className="travel-option">
                <h6>Sacramento (SMF)</h6>
                <p className="caption">
                  Regional option. 65 miles from Napa. Smaller crowds.
                </p>
              </div>
            </div>

            <p className="note">
              <strong>Note:</strong> October is peak season in Wine Country.
              Early booking strongly advised.
            </p>
          </div>
        </article>
      </section>

      {/* The Schedule Section */}
      <section id="the-party" className="grid-section grid-5col border-top">
        <div className="section-header col-span-5 border-bottom">
          <h3 className="section-title">THE SCHEDULE</h3>
          <p className="section-subtitle">A Timeline of Events — Saturday, October 12, 2024</p>
        </div>

        <div className="col-span-5">
          <div className="schedule-table">
            <div className="schedule-row border-bottom">
              <div className="schedule-time">3:30 PM</div>
              <div className="schedule-event">CEREMONY BEGINS</div>
              <div className="schedule-location">Garden Terrace, Silverado Resort</div>
              <div className="schedule-notes">Guests should be seated by 3:20 PM</div>
            </div>

            <div className="schedule-row border-bottom">
              <div className="schedule-time">4:15 PM</div>
              <div className="schedule-event">COCKTAIL HOUR</div>
              <div className="schedule-location">North Lawn</div>
              <div className="schedule-notes">Wine tasting, hors d'oeuvres, live jazz</div>
            </div>

            <div className="schedule-row border-bottom">
              <div className="schedule-time">5:30 PM</div>
              <div className="schedule-event">RECEPTION & DINNER</div>
              <div className="schedule-location">Grand Ballroom</div>
              <div className="schedule-notes">Plated dinner, toasts, and revelry</div>
            </div>

            <div className="schedule-row border-bottom">
              <div className="schedule-time">7:00 PM</div>
              <div className="schedule-event">FIRST DANCE</div>
              <div className="schedule-location">Grand Ballroom</div>
              <div className="schedule-notes">Followed by open dance floor</div>
            </div>

            <div className="schedule-row border-bottom">
              <div className="schedule-time">9:30 PM</div>
              <div className="schedule-event">CAKE CUTTING</div>
              <div className="schedule-location">Grand Ballroom</div>
              <div className="schedule-notes">Dessert service to follow</div>
            </div>

            <div className="schedule-row">
              <div className="schedule-time">11:00 PM</div>
              <div className="schedule-event">LAST CALL</div>
              <div className="schedule-location">Grand Ballroom</div>
              <div className="schedule-notes">Shuttles depart at 11:30 PM</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="grid-section grid-5col border-top">
        <div className="section-header col-span-5 border-bottom">
          <h3 className="section-title">SPECIAL REPORT</h3>
        </div>

        <article className="col-span-5 section-article">
          <h4 className="article-headline">
            An Investigation into the First Date: Sources Allege Instant Chemistry
          </h4>
          <p className="byline">By the Editorial Board · Special Investigative Report</p>

          <div className="article-content story-content grid-5col">
            <div className="col-span-3 border-right story-main">
              <p>
                <strong>SAN FRANCISCO</strong> — On a cool evening in March 2021, two individuals
                entered a dimly lit North Beach establishment, unaware that their lives were
                about to change forever. What transpired over the next three hours has been
                described by witnesses as "magical," "inevitable," and "disgustingly cute."
              </p>

              <p>
                Sarah Thompson, then 27, was skeptical. After a series of disappointing
                dating app encounters, she had nearly given up on finding someone who
                shared her passion for terrible puns and early-morning hikes. James Anderson,
                29, was equally wary, having recently sworn off online dating entirely.
              </p>

              <p>
                But their mutual friend, Rachel Martinez, was convinced they were perfect
                for each other. "I knew within five minutes of meeting each of them," Ms.
                Martinez testified. "Same weird sense of humor. Same values. Same inability
                to resist a good bookstore."
              </p>

              <p>
                The setup worked. Over craft cocktails and shared appetizers, the conversation
                flowed effortlessly. When the bar closed, they continued talking on a bench
                in Washington Square Park until nearly 2 AM.
              </p>

              <p>
                "I remember thinking, 'This is either going to be the best relationship of
                my life or the most devastating heartbreak,'" Ms. Thompson recalled in a
                recent interview. "Fortunately, it was the former."
              </p>

              <h5 className="subsection-title">THE PROPOSAL</h5>

              <p>
                Fast forward to September 2023. Mr. Anderson had been planning for months.
                He knew Sarah loved the coast, particularly the rugged beauty of Mendocino.
                He booked a weekend at a cliffside inn, arranged for a private dinner on
                the terrace, and carried the ring in his pocket for two days, waiting for
                the perfect moment.
              </p>

              <p>
                It came during a sunset walk along the headlands. As the sky turned
                brilliant shades of orange and pink, he stopped, took her hands, and
                delivered a speech he'd been rehearsing for weeks.
              </p>

              <p>
                "I completely forgot everything I planned to say," Mr. Anderson admitted.
                "But it didn't matter. She said yes before I even got the ring out of my
                pocket."
              </p>
            </div>

            <div className="col-span-2 story-sidebar">
              <div className="timeline-box">
                <h6>KEY DATES</h6>
                <ul className="timeline-list">
                  <li>
                    <strong>March 2021</strong><br />
                    First date in North Beach
                  </li>
                  <li>
                    <strong>July 2021</strong><br />
                    First road trip to Yosemite
                  </li>
                  <li>
                    <strong>December 2021</strong><br />
                    Move in together (Noe Valley)
                  </li>
                  <li>
                    <strong>June 2022</strong><br />
                    Adopt their dog, Baxter
                  </li>
                  <li>
                    <strong>September 2023</strong><br />
                    Engagement in Mendocino
                  </li>
                  <li>
                    <strong>October 2024</strong><br />
                    The wedding
                  </li>
                </ul>
              </div>

              <div className="quote-box-small">
                <blockquote>
                  "I knew within five minutes of meeting each of them. Same weird
                  sense of humor. Same values. Same inability to resist a good bookstore."
                </blockquote>
                <cite>— Rachel Martinez, matchmaker</cite>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Registry Section - Classifieds Style */}
      <section id="registry" className="grid-section border-top">
        <div className="section-header border-bottom">
          <h3 className="section-title">CLASSIFIEDS</h3>
        </div>

        <div className="classifieds-content">
          <div className="classified-notice">
            <p className="classified-header">NOTICE TO GUESTS</p>
            <p className="classified-text">
              Your presence at our wedding is the greatest gift we could ask for.
              For those who have inquired about registries, we have established
              accounts with the following institutions:
            </p>
          </div>

          <div className="classified-grid">
            <div className="classified-item border-all">
              <h6>CRATE & BARREL</h6>
              <p>For the home we're building together</p>
              <a href="#" className="classified-link">VIEW REGISTRY →</a>
            </div>

            <div className="classified-item border-all">
              <h6>WILLIAMS SONOMA</h6>
              <p>Culinary essentials for ambitious home cooks</p>
              <a href="#" className="classified-link">VIEW REGISTRY →</a>
            </div>

            <div className="classified-item border-all">
              <h6>HONEYMOON FUND</h6>
              <p>Adventures in Japan, 2025</p>
              <a href="#" className="classified-link">CONTRIBUTE →</a>
            </div>

            <div className="classified-item border-all">
              <h6>CHARITY: WATER</h6>
              <p>Clean water for communities in need</p>
              <a href="#" className="classified-link">DONATE →</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentGrid;
