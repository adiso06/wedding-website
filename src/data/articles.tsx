import React from 'react';
import PullQuote from '../components/PullQuote';

// Article data structure
export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  date: string;
  content: React.ReactNode;
  category?: string;
  summary: string;
}

export const articles: Article[] = [
  {
    id: 'merger',
    title: 'A Union of Hearts: The Couple to Wed This December in California',
    subtitle: 'You are cordially invited to the wedding of Aditya Sood and Chhaya Arora. Feel free to click around and read these fun articles, or jump to the RSVP here.',
    author: 'The Editorial Board',
    date: 'Dec. 15, 2024',
    category: 'BREAKING NEWS',
    summary: 'In a move anticipated by close friends and family for years, Chhaya Arora, an Amazon Product Manager, and Aditya Sood, a future Gastroenterology Fellow, announce their merger.',
    content: (
      <>
        <p><strong>CORONA, Calif.</strong> — In a move anticipated by close friends and family for years, Chhaya Arora, a Senior Product Manager at Amazon, and Dr. Aditya Sood, a future Gastroenterology Fellow, announced their intention to merge operations effective March 15, 2026.</p>

        <p>The proposed merger, first discussed during an FBLA competition years ago when both parties were ostensibly focused on competitive business analysis, has been under careful negotiation ever since. Sources close to both parties report that the initial acquisition strategy was "awkward but charming," though it proved successful in the long term.</p>

        <p>"We have conducted extensive due diligence over the years," said Ms. Arora in a prepared statement. "The data suggests this partnership will yield significant returns in happiness, shared adventures, and quite possibly, excellent home-cooked meals."</p>

        <p>The merger is expected to combine Ms. Arora's expertise in product strategy and innovation with Dr. Sood's commitment to gastroenterological excellence and patient care. Industry analysts predict a strong synergy between technology and medicine, with potential expansion into joint ventures yet to be announced.</p>

        <h3>The Ratification</h3>

        <p>After years of steady partnership growth, Dr. Sood formally moved to ratify the relationship in Long Island City. The proposal took place at a carefully selected location, with Dr. Sood presenting the ring in a moment he had been planning in advance.</p>

        <p>"I was completely surprised," Ms. Arora stated in a recent interview. "I thought we were just going out for the day."</p>

        <p>The proposal was accepted immediately, with no conditions or amendments. Bystanders reported the weather was favorable, and the entire negotiation concluded successfully within minutes.</p>

        <p>"It has been a steady, beautiful journey ever since we met," Dr. Sood noted, referencing their years-long partnership.</p>
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

        <p>"It has been a wonderful, steady partnership ever since," Dr. Sood noted, employing relationship terminology that would have made their FBLA advisors proud.</p>
      </>
    ),
  },
  {
    id: 'letter-from-couple',
    title: 'Gratitude for Our Community',
    subtitle: 'A reflection on the village that has helped us build our life together',
    author: 'Aditya & Chhaya',
    date: 'Dec. 15, 2024',
    category: 'LETTER FROM THE COUPLE',
    summary: 'As we approach this milestone, we reflect on the village that has helped us build our life together.',
    content: (
      <>
        <p><strong>To Our Dearest Village,</strong></p>
        
        <p>As we get ready to celebrate, we've been reflecting on everything that brought us here. The truth is, we are who we are because of you. You have raised us, supported us, challenged us, and loved us through every chapter of our lives.</p>

        <p>Whether you're family who has known us since birth, or friends who became family along the way, you have shaped our stories. You've been there for the big milestones and the quiet moments, the late-night calls and the shared meals. Your support has been our foundation.</p>

        <p>We are so incredibly excited to celebrate this milestone with you. This isn't just about the two of us; it's about all of us coming together to celebrate love, community, and the future we're building.</p>

        <p>Thank you for everything. We can't wait to see you.</p>

        <p><em>With love and gratitude,<br/>Aditya & Chhaya</em></p>
      </>
    ),
  },
  {
    id: 'accommodations',
    title: 'Travel Guide Released for Wedding Guests',
    subtitle: 'Infrastructure advisory issued: Personal transportation required for multi-venue celebration',
    author: 'The Logistics Committee',
    date: 'Dec. 15, 2024',
    category: 'TRAVEL & LEISURE',
    summary: 'Complete travel information for attendees. Ontario Airport recommended; car rentals strongly advised.',
    content: (
      <>
        <p><strong>CORONA, Calif.</strong> — The Logistics Committee has released comprehensive travel information for all attendees of the Arora-Sood celebration. Here's everything you need to know for your trip to Southern California.</p>

        <h3>Flying In</h3>
        <p>Wedding logistics experts recommend booking flights into one of three Southern California airports:</p>
        <ul>
          <li><strong>Ontario International Airport (ONT) ⭐ Best Option</strong> - Adjacent to venue. Distance: ~2 miles (~5-10 minutes). The venue is practically next door to this airport. Rental cars and rideshares readily available.</li>
          <li><strong>John Wayne Airport (SNA)</strong> - Distance: ~35 miles (~40-60 minutes). A good alternative if ONT flights are unavailable; significantly closer than LAX.</li>
          <li><strong>Los Angeles International (LAX)</strong> - Distance: ~55 miles (~60-90+ minutes, highly traffic-dependent). Major international hub with the most flight options, but requires a longer drive through heavy traffic.</li>
        </ul>

        <h3>Staying</h3>
        <p>Recommended accommodations for wedding guests:</p>
        <ul>
          <li><strong>The Mission Inn Hotel & Spa (Riverside, CA)</strong> - Historic, scenic, and unique. A destination in itself. Highly recommended. Distance: ~15 minutes from venue.</li>
          <li><strong>Ayres Hotel Chino Hills (Chino Hills, CA)</strong> - Boutique-style and scenic. Located near The Shoppes at Chino Hills. Distance: ~15 minutes from venue.</li>
          <li><strong>DoubleTree by Hilton Ontario Airport (Ontario, CA)</strong> - Modern and convenient. Very close to airport and wedding venue. Distance: ~5 minutes from venue.</li>
        </ul>

        <h3>Transportation</h3>
        <p><strong>Important Advisory:</strong> Car rentals are recommended over Ubers. The celebration will take place across multiple venues in the Chino Hills area.</p>

        <PullQuote quote="Delegates are strongly encouraged to secure rental vehicles for the duration of their stay. No centralized shuttle service will be provided." />

        <p>Recommended rental agencies operate from all three airports. A rental car will give you the most flexibility during your stay.</p>
      </>
    ),
  },
  {
    id: 'schedule',
    title: 'Complete Timeline of Weekend Events Released; Baraat Assembly at 9:00 AM Sharp',
    subtitle: 'Two-day celebration schedule finalized; select guests invited to Friday festivities',
    author: 'The Events Committee',
    date: 'Dec. 15, 2024',
    category: 'THE SCHEDULE',
    summary: 'Full timeline for March 14-15, 2026 celebration. Main events Sunday; Western schedule strictly enforced.',
    content: (
      <>
        <p><strong>CORONA, Calif.</strong> — The complete schedule for the weekend of March 14-15, 2026 has been released. All times are subject to change based on meteorological conditions and the whims of extended family.</p>

        <h3>Friday, March 14th (Select Guests Only)</h3>

        <p><strong>2:00 PM - Haldi Ceremony</strong><br />
          Traditional pre-wedding ritual. Dress Code: Indian attire recommended. Duration approximately 3 hours.</p>

        <p><strong>5:00 PM - Dinner Service</strong><br />
          Meal service for Haldi attendees.</p>

        <p><strong>6:00 PM - Evening Gathering</strong><br />
          Informal celebrations continue through 9:00 PM.</p>

        <h3>Sunday, March 15th (All Guests)</h3>

        <p><strong>9:00 AM–9:45 AM - ADITYA'S BARAAT</strong><br />
          <em>Meet up: 8:45 AM</em><br />
          The wedding procession for the groom involving live music and dancing. Please note that the time here is prompt.</p>

        <p><strong>10:00 AM–12:30 PM - WEDDING CEREMONY</strong><br />
          BAPS Mandir, Chino Hills. The bride and groom take seven steps and vows around the fire to represent the beginning of their journey together. Dress Code: Indian attire strongly preferred; formal suits acceptable.</p>

        <p><strong>12:30 PM–2:00 PM - LUNCH</strong><br />
          Traditional Indian vegetarian meal after ceremony at BAPS Mandir.</p>

        <p><strong>6:00 PM–7:00 PM - COCKTAIL HOUR</strong><br />
          Majestic Banquet Hall, Chino Hills. Hors d'oeuvres and cocktails to kick off the night.</p>

        <p><strong>7:00 PM–12:00 AM - RECEPTION</strong><br />
          Please join us for a night of partying to celebrate us as newlyweds! Dress Code: Indo-Western fusion or Western formal attire.</p>

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
    title: 'Wedding Registry Market Shows Promising Trends',
    subtitle: 'Cash Contributions Preferred for Future Ventures',
    author: 'The Financial Desk',
    date: 'Dec. 15, 2024',
    category: 'MARKETS',
    summary: 'The couple announces a streamlined approach to wedding gifts, opting for cash contributions only.',
    content: (
      <>
        <p><strong>CORONA, Calif.</strong> — In a move that delights financial planners everywhere, the Arora-Sood merger team has announced they will not be maintaining a traditional wedding registry. Instead, they're embracing the flexibility and practicality of cash contributions only.</p>

        <p>"As we live in New York but are celebrating in California, we kindly ask for no boxed gifts to avoid the logistics of shipping them cross-country," Ms. Arora explained in a recent statement. "What we need is the freedom to build our future together on our own terms."</p>

        <p>The decision reflects both practical considerations and a growing trend among couples who are establishing their households later in life. With two fully-equipped apartments already in operation and a cross-country move to consider, the need for physical gifts is minimal.</p>

        <h3>The Cash Gift Advantage</h3>

        <p>Rather than accumulating physical items that would need to be shipped from California to New York, the couple has opted for a streamlined approach. Cash contributions will be accepted at the reception in a secure card box, allowing guests to participate in the couple's future plans without the complications of cross-country logistics.</p>

        <p>"Think of it as a Series A funding round for our married life," Dr. Sood joked, referencing his fiancée's tech industry background. "Investors can contribute to our growth without worrying about shipping costs or whether we already own that particular kitchen gadget."</p>

        <h3>How It Works</h3>

        <p>Guests wishing to contribute may bring cards and cash gifts to the reception, where a beautifully decorated secure box will be available. For those who prefer digital transactions, the couple can provide payment app details upon request.</p>

        <p>"We understand that some people prefer the tangibility of registry shopping," Ms. Arora noted. "But honestly, with the logistics of living in New York and celebrating in California, cash gives us the flexibility to invest in what we truly need—whether that's furnishing our new home together, planning adventures, or saving for future goals."</p>

        <h3>A Practical Alternative</h3>

        <p>Wedding gift experts note that cash funds are increasingly popular among modern couples, especially those navigating cross-country logistics. "It eliminates the anxiety of 'did they already get this?' and 'how do we ship this across the country?'" explained etiquette consultant Emily Post Jr. "Plus, it respects the couple's practical needs."</p>

        <p>The couple emphasized that the greatest gift remains guests' presence at the celebration. "Your attendance means everything," they noted in a joint statement. "Any contribution beyond that is generous icing on an already perfect cake."</p>

        <h3>The Bottom Line</h3>

        <p>For those accustomed to browsing registry websites, this approach may feel unfamiliar. But consider the logistics: instead of selecting a toaster that needs to be shipped from California to New York, you're contributing to a fund that supports the couple's future without the cross-country shipping headaches.</p>

        <p>"We're building a life, not just accumulating items that need to be moved across the country," Dr. Sood summarized. "And we're grateful to anyone who wants to support that journey."</p>

        <p><em>A secure card box will be available at the reception. For more information, visit <a href="https://www.theknot.com/us/chhaya-arora-and-aditya-sood-mar-2026/registry" target="_blank" rel="noopener noreferrer">our registry page on The Knot</a>.</em></p>
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

        <p>When the Arora-Sood partnership was first announced to close friends and family, there were the usual concerns. Could a relationship survive the demands of medical residency? Would the tech industry's relentless pace leave room for romance? What about the 2,800 miles that once separated Seattle from New York?</p>

        <p>But here's what the critics missed: complementary skill sets matter more than geographic proximity.</p>

        <h3>The Case for Strategic Compatibility</h3>

        <p>Consider the fundamentals. Ms. Arora brings product strategy, data-driven decision-making, and an ability to optimize any process. Dr. Sood contributes medical expertise, patience cultivated through years of training, and a commitment to helping others. Where one sees systems, the other sees people. Where one optimizes for efficiency, the other optimizes for care.</p>

        <p>This is not a merger of convenience. This is a merger of conviction.</p>

        <h3>The Technology Advantage</h3>

        <p>The skeptics who cited geographic distance clearly haven't lived through 2020. This couple mastered long-distance communication when video calls became a primary mode of human connection. They've logged more FaceTime hours than most married couples log in-person conversations. When you can maintain emotional intimacy across time zones, sharing a zip code is almost too easy.</p>

        <h3>Shared Values, Divergent Expertise</h3>

        <p>What truly makes this partnership work is the alignment of core values alongside the diversity of professional expertise. Both are driven by a desire to make things better—whether that's a product feature or a patient's health. Both value family, though they come from different family structures. Both love good food, though they debate the proper ratio of spice to flavor.</p>

        <p>They challenge each other intellectually. They support each other emotionally. They make each other laugh, which in a multi-decade partnership, may be the most valuable asset of all.</p>

        <h3>The Long-Term Outlook</h3>

        <p>Some mergers are driven by short-term gains. Others are built for the long haul. This is clearly the latter. The couple has already weathered the volatility of medical school, cross-country relocations, career transitions, and the general chaos of early adulthood. They've stress-tested this relationship under conditions that would have broken weaker partnerships.</p>

        <p>So yes, critics had their doubts. But the data is in, and it's conclusive: this merger makes perfect sense. The synergy is real. The ROI on happiness is already substantial. And the long-term projections? Exceptionally promising.</p>

        <p><em>The Editorial Board has been following this relationship since the FBLA days and stands by this analysis.</em></p>
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

        <p><strong>CORONA, Calif.</strong> — What happens when you combine Amazon's product management methodologies with the precision of gastroenterology? According to Ms. Arora and Dr. Sood, you get some very interesting dinner conversations—and possibly, the future of healthcare technology.</p>

        <h3>The Great Sprint Planning Incident</h3>

        <p>"It started innocently enough," Dr. Sood recalled. "Chhaya mentioned she was working on improving a user workflow, and I joked that I spend my days optimizing a different kind of workflow—the digestive one."</p>

        <p>What followed was a two-hour discussion about whether the human digestive system could benefit from Agile sprint planning. Could you A/B test dietary interventions? Should patient care be organized into two-week sprints? What are the KPIs for a healthy gut?</p>

        <p>"I may have created a Jira board for meal planning," Ms. Arora admitted. "Aditya was not amused. But it was very efficient."</p>

        <h3>Machine Learning Meets Medical School</h3>

        <p>The conversation took a more serious turn when they began discussing the actual applications of AI in gastroenterology. Dr. Sood noted that machine learning is already being used to detect polyps during colonoscopies, improving early cancer detection rates.</p>

        <p>"The technology is there," he explained. "Computer vision models can identify suspicious lesions that human eyes might miss. It's not about replacing physicians—it's about augmenting our capabilities."</p>

        <p>Ms. Arora, who has spent years thinking about user experience and product adoption, immediately saw the challenges. "The technology is only valuable if doctors actually use it. You need seamless integration into existing workflows. You need trust in the AI's recommendations. You need to solve the actual problem, not just build cool tech."</p>

        <h3>The Optimization Paradox</h3>

        <p>Their discussions often highlight a fundamental tension between tech and medicine. Technology companies optimize for speed and scale. Medicine optimizes for accuracy and individual care. Technology moves fast and breaks things. Medicine takes its time and fixes things.</p>

        <p>"I've learned that 'move fast and break things' doesn't work when the things are people," Ms. Arora noted.</p>

        <p>"And I've learned that technology can actually help me spend more time with patients, not less," Dr. Sood added. "If AI can handle the routine pattern recognition, I can focus on the complex cases and the human connection."</p>

        <h3>The White Paper (That May Actually Happen)</h3>

        <p>What started as dinner table banter has evolved into genuine intellectual collaboration. The couple has discussed co-authoring a paper on the human factors challenges in deploying AI for gastroenterology—bringing together Ms. Arora's product expertise and Dr. Sood's medical knowledge.</p>

        <p>"We probably won't call it 'Agile Digestion,'" Dr. Sood said. "Though Chhaya keeps pushing for it."</p>

        <p>Whether the white paper materializes or not, one thing is clear: when tech meets medicine at the dinner table, the conversation is never boring.</p>

        <p><em>Neither party was compensated for this article, though Dr. Sood did request we mention he's still right about the Jira board being unnecessary.</em></p>
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

        <p><strong>CHINO HILLS, Calif.</strong> — Just 32 miles from Los Angeles and a short drive from Disneyland, Chino Hills offers more than just wedding venues. For guests arriving early or staying late, this Southern California gem has plenty to offer. Here's how to make the most of your weekend.</p>

        <h3>Friday Afternoon: Explore the Outdoors</h3>

        <p><strong>2:00 PM - Chino Hills State Park</strong><br />
          With over 16,000 acres of rolling hills and 90 miles of trails, this state park is a hiker's paradise. If you're looking to stretch your legs before the wedding festivities, take a moderate hike through the valleys and along ridge tops. The park offers stunning views of the surrounding area and a peaceful escape from urban life. Bring water—Southern California sun is no joke, even in March.</p>

        <h3>Friday Evening: Cultural Experience</h3>

        <p><strong>5:00 PM - BAPS Shri Swaminarayan Mandir</strong><br />
          Before Sunday's ceremony, consider visiting the stunning BAPS Mandir where the wedding will take place. This architectural marvel features 35,000 pieces of hand-carved Italian Carrara marble and Indian pink sandstone, with five pinnacles, two large domes, and 122 pillars. The mandir is open to visitors daily from 9 AM to 7:30 PM. Remember: modest attire required (shoulders, back, chest, and knees covered), and remove your shoes before entering. Photography is not allowed inside, but the experience is unforgettable.</p>

        <h3>Sunday Morning: Breakfast and Shopping</h3>

        <p><strong>8:00 AM - Breakfast Options</strong><br />
          Grab breakfast at one of Chino Hills' many cafes before the Baraat. Local favorites serve everything from classic American breakfast to Korean-fusion options.</p>

        <p><strong>9:00 AM - The Shoppes at Chino Hills</strong><br />
          If you need any last-minute items for the wedding, this shopping center has over 70 stores including H&M, Banana Republic, and Victoria's Secret. There's also a Trader Joe's if you need snacks for your hotel room.</p>

        <h3>Sunday Evening: Post-Reception Wind Down</h3>

        <p><strong>Late Night - Yoshiharu Ramen</strong><br />
          After hours of dancing, you might be craving comfort food. Yoshiharu Ramen serves some of the best ramen in the area and is perfect for a late-night meal with fellow wedding guests.</p>

        <h3>Sunday: Brunch and Leisure</h3>

        <p><strong>11:00 AM - Wood Ranch BBQ & Grill</strong><br />
          Before heading home, stop by Wood Ranch for award-winning smoked brisket, Carolina pulled pork, and baby back ribs. Their tri-tip is legendary. It's the perfect hearty brunch to fuel your journey home.</p>

        <p><strong>Alternative: Seoul Haus</strong><br />
          If you're in the mood for Korean cuisine, Seoul Haus offers an excellent selection and is a local favorite.</p>

        <h3>For the Adventurous: Golf</h3>

        <p>Golf enthusiasts will find several courses nearby, including Los Serranos Golf and Country Club, Green River Golf Course, and Western Hills Golf and Country Club. Book tee times in advance.</p>

        <h3>For Families: Entertainment Options</h3>

        <p><strong>Chaparral 300 Bowling Center</strong><br />
          This 34-lane bowling center features a full sports bar, pool tables, shuffleboard, darts, arcade games, and even a mechanical bull. Great for keeping kids (and adults) entertained.</p>

        <h3>Nearby Attractions</h3>

        <p>If you're extending your Southern California trip:</p>
        <ul>
          <li><strong>Disneyland Resort</strong> - 30 minutes away</li>
          <li><strong>Los Angeles</strong> - 45 minutes to downtown</li>
          <li><strong>Beaches</strong> - Orange County beaches are 40 minutes away</li>
        </ul>

        <p><em>Pro tip: Download a navigation app. Chino Hills has hills (shocking, we know), and GPS will save you from getting lost on winding residential streets.</em></p>
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

        <p><strong>NEW YORK/MUMBAI</strong> — As wedding season approaches, fashion insiders are witnessing a renaissance of Indo-Western fusion wear, with the classic Nehru jacket leading the charge. For guests attending the Arora-Sood celebration, understanding this style evolution is essential.</p>

        <h3>What is Indo-Western?</h3>

        <p>Indo-Western fashion represents the marriage of Indian artistry with Western tailoring. Think intricate embroidery and traditional draping combined with structured blazers, contemporary cuts, and modern silhouettes. The result? Attire that honors cultural heritage while embracing contemporary aesthetics.</p>

        <p>"It's the best of both worlds," explains fashion designer Manish Malhotra. "You get the grandeur of traditional bridal wear with the comfort and modernity of Western fashion."</p>

        <h3>The Nehru Jacket: A Style Icon Returns</h3>

        <p>Named after India's first Prime Minister Jawaharlal Nehru, the Nehru jacket features a mandarin collar and a tailored fit. Originally a symbol of Indian independence and sophistication, it's experiencing a major moment in contemporary fashion.</p>

        <p>Modern interpretations come in rich fabrics like silk, brocade, and velvet, often featuring elaborate embroidery, beadwork, or metallic threading. Pair it with fitted trousers or traditional churidar pants, and you have a look that works equally well at a temple ceremony or an upscale reception.</p>

        <h3>Popular Indo-Western Styles for Wedding Season</h3>

        <p><strong>For Men:</strong></p>
        <ul>
          <li>Nehru jackets paired with dress pants</li>
          <li>Bandhgala suits with Western-style trousers</li>
          <li>Sherwani jackets worn with tailored pants instead of traditional churidar</li>
          <li>Kurtas with waistcoats and formal trousers</li>
        </ul>

        <p><strong>For Women:</strong></p>
        <ul>
          <li>Lehenga gowns (combining the volume of a lehenga with the structure of a gown)</li>
          <li>Saree gowns and pre-draped sarees with modern blouses</li>
          <li>Jacket lehengas with structured blazers</li>
          <li>Dhoti pants with crop tops or embellished blouses</li>
          <li>Anarkali suits with contemporary cuts</li>
          <li>Cape-style kurtas with palazzo pants</li>
        </ul>

        <h3>Fabrics and Colors Trending Now</h3>

        <p>Georgette, silk, chiffon, and net dominate the Indo-Western market for their ability to hold traditional embellishments while maintaining modern drape. Color palettes have expanded beyond traditional reds and golds to include blush pink, mint green, lavender, champagne, and even midnight blue.</p>

        <p>"We're seeing a lot of pastels and jewel tones," notes stylist Anaita Shroff Adajania. "The key is choosing colors that photograph well but don't compete with the bride's outfit."</p>

        <h3>Styling Tips for the Arora-Sood Wedding</h3>

        <p>For the Sunday reception, which specifies "Indo-Western or Western formal," consider:</p>

        <ul>
          <li><strong>Keep it balanced:</strong> If your top is heavily embellished, keep the bottom simple, and vice versa</li>
          <li><strong>Accessorize thoughtfully:</strong> Statement jewelry works with simpler outfits; minimal jewelry complements elaborate ensembles</li>
          <li><strong>Comfort matters:</strong> You'll be celebrating for hours. Choose fabrics and fits that allow movement</li>
          <li><strong>Weather-appropriate:</strong> March in Chino Hills averages 60-75°F. Lightweight fabrics are your friend</li>
          <li><strong>Respect the venue:</strong> For the temple ceremony, ensure shoulders, back, chest, and knees are covered</li>
        </ul>

        <h3>Where to Shop</h3>

        <p>Indo-Western wear is increasingly available online through retailers like Utsav Fashion, KALKI Fashion, Manyavar (for men), and G3 Fashion. Many designers now ship internationally, making it easier than ever to find the perfect fusion outfit.</p>

        <p>"The beauty of Indo-Western style is its versatility," says designer Sabyasachi Mukherjee. "You can wear these pieces again to other events, mix and match components, and truly make the style your own."</p>

        <p><em>Bottom line: Whether you choose a traditional Nehru jacket or a modern lehenga gown, Indo-Western fashion offers endless possibilities for looking spectacular at this cross-cultural celebration.</em></p>
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

        <p><strong>CORONA, Calif.</strong> — While most wedding weekends feature rehearsal dinners and champagne toasts, the Arora-Sood celebration may include something more competitive: a cricket match between Team Bride and Team Groom.</p>

        <p>The proposed showdown, currently being debated in multiple family WhatsApp groups, has already generated more controversy than the wedding seating chart.</p>

        <h3>The Lineup Analysis</h3>

        <p><strong>Team Groom</strong> claims superior bowling depth, citing Dr. Sood's younger cousins who "definitely played cricket at least three times in high school." One team member was overheard saying, "We have spin bowlers, we have pace bowlers, we have people who can probably bowl if we give them five minutes of practice."</p>

        <p>Team Groom's batting lineup remains questionable. While several members claim proficiency, sources close to the team note that most of their cricket experience comes from watching IPL matches while eating snacks.</p>

        <p><strong>Team Bride</strong> has been quieter in their public statements, leading many to believe they're either supremely confident or have no idea what they've gotten themselves into. Ms. Arora's brother reportedly has "pretty good hand-eye coordination from video games," which teammates are generously counting as athletic credentials.</p>

        <p>However, Team Bride's secret weapon may be their fielding. "We're younger and faster," one member noted. "When your strategy is just 'run really fast and hope you catch it,' youth is an advantage."</p>

        <h3>The Venue Debate</h3>

        <p>Securing an appropriate cricket pitch in Southern California has proven challenging. Early proposals included "that big empty parking lot near the hotel" and "someone's backyard, probably." Local parks have been scouted, though organizers admit that actual cricket equipment might be in short supply.</p>

        <p>"We have one cricket bat, two tennis balls, and a lot of enthusiasm," reported the informal event coordinator. "That's basically all you need, right?"</p>

        <h3>Rules and Regulations</h3>

        <p>The proposed match would follow "modified backyard cricket rules," which sources describe as "real cricket rules, but we ignore the ones we don't understand." Key modifications include:</p>

        <ul>
          <li>Unlimited overs (or until people get tired)</li>
          <li>Tennis ball instead of cricket ball (to minimize emergency room visits)</li>
          <li>Any vertical object can serve as wickets (traffic cones, water bottles, a very patient uncle)</li>
          <li>Disputes resolved by the oldest auntie present, whose word is final</li>
          <li>Snack break mandatory at the halfway point</li>
        </ul>

        <h3>The Stakes</h3>

        <p>While no official prize has been announced, both teams have suggested that the losing side should perform an embarrassing dance at the reception. This proposal has been met with enthusiasm from wedding guests and horror from the potential performers.</p>

        <p>"The real winner is everyone watching," noted one family member. "This is going to be hilarious."</p>

        <h3>Expert Analysis</h3>

        <p>Professional cricket analysts have declined to comment on the match, mostly because no professional cricket analysts could be located in Chino Hills. However, one uncle who "used to play in college" offered his assessment:</p>

        <p>"They're both going to be terrible. But it'll be fun."</p>

        <h3>Will It Actually Happen?</h3>

        <p>As of press time, the cricket match remains in the "enthusiastic planning stage," which traditionally means there's a 30% chance it actually occurs and a 70% chance everyone agrees it's too much work and they should just eat appetizers instead.</p>

        <p>But hope springs eternal in the family WhatsApp group, where the trash talk continues and someone just suggested they should also organize a volleyball tournament.</p>

        <p><em>The Sports Desk will continue monitoring this developing story. Updates to follow, assuming anyone remembers to bring the cricket bat.</em></p>
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

        <p><strong>CORONA, Calif.</strong> — The local short-term rental market is experiencing unprecedented demand as wedding guests scramble to secure accommodations for the March 15th Arora-Sood celebration. What's typically a quiet weekend in Southern California suburbia has transformed into a seller's market for Airbnb hosts and hotel operators.</p>

        <h3>The Booking Rush</h3>

        <p>"I listed my guest house in November, and it was booked within 48 hours," reported Maria Chen, a Superhost in Chino Hills. "Then I got six more inquiries asking if I had any other properties available. I don't, but I'm considering buying one."</p>

        <p>The surge in demand extends beyond Chino Hills proper, with guests booking accommodations in neighboring communities including Diamond Bar, Pomona, and even as far as Ontario and Riverside. The official hotel block at Mission Inn in Riverside has become prime real estate, with early bookers congratulating themselves on their foresight.</p>

        <h3>Pricing Dynamics</h3>

        <p>Wedding weekends traditionally command premium pricing, and this event is no exception. Properties that typically rent for $150 per night are now listing for $250-$300 for the March 14-16 weekend. Some hosts report receiving offers above asking price from desperate guests who waited too long to book.</p>

        <p>"I've had people offer to pay extra if I'll cancel existing bookings," said one host who declined to be named. "I would never do that, but it shows you how competitive it's gotten."</p>

        <h3>The Hotel Situation</h3>

        <p>Local hotels are also experiencing the wedding effect. The Mission Inn, serving as the official hotel for the event, has negotiated group rates for attendees. However, guests are advised to book sooner rather than later, as availability diminishes with each passing week.</p>

        <p>"March is usually moderate for us," explained a front desk manager at a nearby hotel. "But we're seeing booking patterns more typical of peak summer season. Word of advice: don't wait until February to book."</p>

        <h3>Alternative Strategies</h3>

        <p>For guests still searching for accommodations, real estate experts suggest several strategies:</p>

        <ul>
          <li><strong>Expand your search radius:</strong> Properties 15-20 miles from Chino Hills may still have availability</li>
          <li><strong>Consider VRBO and other platforms:</strong> Don't limit yourself to just Airbnb</li>
          <li><strong>Group bookings:</strong> Larger properties can accommodate multiple guests, splitting costs</li>
          <li><strong>Corporate hotels:</strong> Check business-oriented hotels that may not be on typical wedding guest radars</li>
          <li><strong>Ontario Airport hotels:</strong> Often overlooked but convenient, especially for those flying in</li>
        </ul>

        <h3>The Broader Economic Impact</h3>

        <p>The accommodation boom is just one indicator of the wedding's economic impact on the local area. Restaurants are preparing for increased reservations, rental car agencies are noting higher demand, and local gas stations are stocking up for the weekend influx.</p>

        <p>"It's great for local business," noted Chino Hills Chamber of Commerce representative David Park. "We love hosting celebrations like this. It brings people to our community who might not otherwise visit."</p>

        <h3>Looking Ahead</h3>

        <p>For those who have secured housing, congratulations—you've won the first round of wedding weekend logistics. For those still searching, act quickly. As one Airbnb host succinctly put it: "Inventory is limited, demand is high, and March 15th isn't getting any further away."</p>

        <p><em>Real Estate Desk Tip: If you're still looking for accommodations, check the official wedding website for updates on additional hotel blocks or group housing options.</em></p>
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

        <p><strong>CORONA, Calif.</strong> — As the March 15th celebration approaches, rumors have emerged suggesting that Dr. Aditya Sood may be secretly practicing dance choreography for the wedding reception. The Arts & Culture desk has investigated these claims and can now report: the situation is complicated.</p>

        <h3>The Evidence</h3>

        <p>Last Tuesday, a grainy 8-second video appeared on Instagram Stories, allegedly showing the groom-to-be in his living room, attempting what witnesses describe as "either a Bhangra move or perhaps just reaching for something on a high shelf." The video was deleted within 30 minutes, but not before several eagle-eyed cousins took screenshots.</p>

        <p>"I definitely saw arm movements," reported one anonymous source. "Whether they were choreographed or just... movements... remains unclear."</p>

        <h3>Expert Analysis</h3>

        <p>We consulted with professional choreographer Priya Sharma, who has worked on numerous Bollywood productions and wedding performances. After reviewing the leaked footage, her assessment was diplomatic:</p>

        <p>"He's trying. That's the most important thing. Is he a natural dancer? Well... he's enthusiastic."</p>

        <p>When pressed for further comment, Sharma added: "Look, not everyone needs to be a professional. The fact that he's willing to get out there and perform for his bride shows character. Also, the bar is low for grooms. If he can stay on beat for 30 seconds, people will lose their minds with excitement."</p>

        <h3>The Bride's Response</h3>

        <p>Ms. Arora, when asked about her fiancé's dance preparations, offered a carefully measured statement: "Aditya has many talents. Dancing may or may not be one of them. But I love him anyway, and that's what matters."</p>

        <p>She then added, off the record, "I've told him that if he just sways and smiles, that's totally fine. We've set very achievable goals."</p>

        <h3>The Performance Plans</h3>

        <p>According to sources close to the couple, the reception will feature several choreographed performances by friends and family members. The couple themselves may participate in one or two dances, though the level of choreographic complexity remains classified information.</p>

        <p>"We're not trying to win 'America's Got Talent,'" explained one wedding planner familiar with the plans. "We're trying to have fun, celebrate love, and maybe not trip over our own feet. That's the goal."</p>

        <h3>The Practice Schedule</h3>

        <p>Insiders report that small groups of wedding party members have been meeting for "casual rehearsals" at various locations. These sessions allegedly include:</p>

        <ul>
          <li>Learning basic Bhangra steps (with varying degrees of success)</li>
          <li>Practicing synchronization (loosely defined)</li>
          <li>Debating whether matching outfits are necessary (ongoing)</li>
          <li>Taking snack breaks (very successful)</li>
          <li>Watching YouTube videos of professional dancers for "inspiration" (mostly just intimidating)</li>
        </ul>

        <h3>Managing Expectations</h3>

        <p>Wedding dance veterans advise guests to adjust their expectations accordingly. "This isn't a Bollywood movie," cautioned one experienced aunt. "This is real people with real jobs who learned choreography in three weekends. Applaud enthusiastically regardless of execution."</p>

        <p>Another family member noted: "The beauty of wedding dancing is that no one actually cares if you're good. They just want to see you try. Also, by the time the performances happen, everyone will be emotional and probably won't notice any missed steps."</p>

        <h3>The Verdict</h3>

        <p>Is Dr. Sood practicing? The evidence suggests yes, probably, occasionally, when he remembers. Will the performances be flawless? Almost certainly not. Will they be heartfelt, entertaining, and create memories that last a lifetime? Absolutely.</p>

        <p>As Ms. Sharma wisely concluded: "Perfect choreography is overrated. Perfect joy is what matters. And from what I've seen, these two have plenty of that."</p>

        <p><em>The Arts & Culture desk will continue monitoring for additional leaked footage. Tips can be submitted to our confidential hotline (the family WhatsApp group).</em></p>
      </>
    ),
  },
  {
    id: 'med-marvel',
    title: 'Medical Marvel: Couple\'s Heartbeats Synchronize in Scientific First',
    subtitle: 'Cardiologists Baffled; "It beats the odds," says Chief of Medicine',
    author: 'The Science Desk',
    date: 'Dec. 15, 2024',
    category: 'MEDICINE & HEALTH',
    summary: 'In what researchers are calling "romantically statistically significant," the couple has achieved perfect cardiac resonance.',
    content: (
      <>
        <p><strong>LABORATORY REPORT</strong> — In a breakthrough that has stunned the medical community, researchers have confirmed that Ms. Arora and Dr. Sood have achieved a phenomenon previously thought to be theoretically impossible: synchronized cardiac rhythms.</p>

        <p>"We hooked them up to the monitors," said Dr. Cupid, Chief of Cardiology at the Love Institute. "At first, the rhythms were distinct—one was a steady, tech-optimized beat, and the other was a complex, medical-grade rhythm. But as soon as they started discussing dinner plans, the waves aligned perfectly."</p>

        <h3>The Physiology of Partnership</h3>

        <p>The study, published in the <em>Journal of Romantic Medicine</em>, suggests that this synchronization occurs primarily when the subjects are within proximity or sharing a Google Calendar invite. Biological data indicates that their stress levels also drop inversely proportional to the quality of the snacks available.</p>

        <p>"It is a classic case of atrial affinity," Dr. Sood noted, reviewing his own chart. "The P-waves are holding hands."</p>

        <p>Ms. Arora was more pragmatic. "It's just efficient data transfer," she explained. "Why have two beats when one unified beat is more scalable?"</p>

        <h3>Implications for the Future</h3>

        <p>Scientists warn that this level of synchronization could lead to dangerous side effects, such as finishing each other's sentences, accidentally matching outfits, and an inability to decide on a restaurant without a committee meeting.</p>

        <p><em>The FDA has not evaluated these claims, primarily because they are too cute to regulate.</em></p>
      </>
    ),
  }
];




