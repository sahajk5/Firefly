import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('Home');

  const pages = ['Home', 'Heat Map', 'Firefly Chat', 'Community'];

  function renderPage() {
    if (activePage === 'Home') {
      return <HomePage onNavigate={setActivePage} />;
    }

    if (activePage === 'Community') {
      return <CommunityPage />;
    }

    if (activePage === 'Heat Map') {
      return <HeatMapPage />;
    }

    if (activePage === 'Firefly Chat') {
      return <ChatPage />;
    }
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">✦</span>
          <div>
            <h2>Firefly</h2>
            <p>Real Reports. Safer Communities.</p>
          </div>
        </div>

        <div className="nav-links">
          {pages.map((page) => (
            <button
              key={page}
              className={activePage === page ? 'nav-link active' : 'nav-link'}
              onClick={() => setActivePage(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="profile">F</div>
      </nav>

      <main className="page-container">
        {renderPage()}
      </main>

      <footer>
        <p>Firefly — A little light goes a long way.</p>
      </footer>
    </div>
  );
}


// ANIMATED NUMBERS

function AnimatedNumber({ target, start }) {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (!start) {
      return;
    }

    const duration = 1800;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setNumber(Math.floor(target * easedProgress));

      if (progress === 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [start, target]);

  return <span>{number.toLocaleString()}</span>;
}


// EXAMPLE REPORT CARD ARTWORK

function ShieldBadge() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#e6b66c" />
      <path d="M10 4.5l4 1.6v3.4c0 2.6-1.7 4.5-4 5.4-2.3-.9-4-2.8-4-5.4V6.1z" fill="#3a2d1a" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 18s6-5.2 6-9.6A6 6 0 0 0 4 8.4C4 12.8 10 18 10 18z" />
      <circle cx="10" cy="8.4" r="2.2" />
    </svg>
  );
}


// REVIEWS

const reviews = [
  {
    name: 'Anonymous',
    initial: 'S',
    time: '2 hours ago',
    stars: 4.5,
    text: 'I was walking home around 8:30 PM and a man started following me. He said something and kept getting closer. I had to take a different route to get away. This happens often near the station.',
    chip: 'Harassment hotspot',
    location: 'Central Station'
  },
  {
    name: 'Anonymous',
    initial: 'M',
    time: 'Yesterday',
    stars: 5,
    text: 'The bus stop near the mall felt safe at night. There were other people around and the area was well lit.',
    chip: 'Felt safe',
    location: 'Mall Bus Stop'
  },
  {
    name: 'Anonymous',
    initial: 'P',
    time: '2 days ago',
    stars: 3.5,
    text: 'The path behind the parking lot has no lighting after dark. I now take the longer route on the main road instead.',
    chip: 'Poor lighting',
    location: 'Campus North Path'
  },
  {
    name: 'Anonymous',
    initial: 'J',
    time: '4 days ago',
    stars: 4,
    text: 'A staff member checked in when I looked uncomfortable waiting alone. It made a big difference.',
    chip: 'Helpful staff',
    location: 'Maple & 8th'
  },
  {
    name: 'Anonymous',
    initial: 'A',
    time: 'Last week',
    stars: 2.5,
    text: 'The stop is isolated and the shelter light is broken. I would not wait here alone after 9 PM.',
    chip: 'Unsafe transit stop',
    location: 'Riverside Park'
  },
  {
    name: 'Anonymous',
    initial: 'L',
    time: 'Last week',
    stars: 5,
    text: 'Sometimes knowing someone else has experienced the same thing makes all the difference.',
    chip: 'Feeling less alone',
    location: 'Community'
  }
];

function Stars({ value }) {
  return (
    <div className="report-stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const type = n <= value ? 'full' : n - 0.5 === value ? 'half' : 'empty';
        return <span key={n} className={`star ${type}`}>★</span>;
      })}
    </div>
  );
}

function ReviewCard({ review, showTitle, className = '' }) {
  return (
    <article className={`report-card ${className}`}>

      {showTitle && <h3 className="report-title">Reviews</h3>}


      <div className="report-user">
        <div className="report-avatar" aria-hidden="true">
          {review.initial}
        </div>

        <div className="report-user-text">
          <strong>{review.name}</strong>
          <span>{review.time}</span>
        </div>
      </div>

      <Stars value={review.stars} />

      <p className="report-text">{review.text}</p>

      <div className="report-foot">
        <span className="report-chip">
          <ShieldBadge />
          {review.chip}
        </span>

        <span className="report-loc">
          <PinIcon />
          {review.location}
        </span>
      </div>

    </article>
  );
}

function ReviewsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const [showAll, setShowAll] = useState(false);
  const startX = useRef(null);

  function go(step) {
    setDirection(step > 0 ? 'next' : 'prev');
    setIndex((current) => (current + step + reviews.length) % reviews.length);
  }

  function jumpTo(i) {
    setDirection(i > index ? 'next' : 'prev');
    setIndex(i);
  }

  // swipe (touch or mouse drag)

  function onPointerDown(e) {
    startX.current = e.clientX;
  }

  function onPointerUp(e) {
    if (startX.current === null) {
      return;
    }

    const distance = e.clientX - startX.current;
    startX.current = null;

    if (Math.abs(distance) > 50) {
      go(distance < 0 ? 1 : -1);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  }

  useEffect(() => {
    if (!showAll) {
      return;
    }

    const closeOnEscape = (e) => {
      if (e.key === 'Escape') {
        setShowAll(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showAll]);

  return (
    <div className="reviews">

      <div
        className="reviews-viewport"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { startX.current = null; }}
        onKeyDown={onKeyDown}
        tabIndex={0}
        aria-label="Reviews, swipe or use the arrow keys to see the next one"
      >
        <ReviewCard
          key={index}
          review={reviews[index]}
          showTitle
          className={`slide-${direction}`}
        />
      </div>

      <div className="reviews-controls">

        <div className="review-nav">
          <button
            className="review-arrow"
            onClick={() => go(-1)}
            aria-label="Previous review"
          >
            ‹
          </button>

          <div className="review-dots">
            {reviews.map((review, i) => (
              <button
                key={i}
                className={i === index ? 'review-dot active' : 'review-dot'}
                onClick={() => jumpTo(i)}
                aria-label={`Show review ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="review-arrow"
            onClick={() => go(1)}
            aria-label="Next review"
          >
            ›
          </button>
        </div>

        <button className="see-more" onClick={() => setShowAll(true)}>
          See more reviews →
        </button>

      </div>

      {showAll && (
        <div className="reviews-backdrop" onClick={() => setShowAll(false)}>
          <div
            className="reviews-modal"
            role="dialog"
            aria-modal="true"
            aria-label="All reviews"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reviews-modal-head">
              <h3>All reviews</h3>
              <button
                className="modal-close"
                onClick={() => setShowAll(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="reviews-list">
              {reviews.map((review, i) => (
                <ReviewCard key={i} review={review} />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


// FEATURES (shown together inside the first box)

const features = [
  {
    title: 'Safety Heat Map',
    text: 'Discover community-reported safety concerns in different areas.',
    button: 'Explore Map →',
    page: 'Heat Map'
  },
  {
    title: 'Community',
    text: 'Share experiences, exchange advice and support one another.',
    button: 'Join Community →',
    page: 'Community'
  },
  {
    title: 'Firefly Chat',
    text: 'Find guidance and practical safety information when you need it.',
    button: 'Start Chatting →',
    page: 'Firefly Chat'
  }
];


// HOME PAGE

function HomePage({ onNavigate }) {
  const [showStats, setShowStats] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowStats(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">

      {/* HERO SECTION */}

      <section className="home-welcome">

        <div className="welcome-content">

          <p className="eyebrow">
            LIGHT THE WAY. LOOK OUT FOR EACH OTHER.
          </p>

          <h1>
  <span className="headline-line gold">Your Experiences</span>{' '}
  <span className="headline-line cream">Can Light</span>
  <span className="headline-line sage">the Way to Safety.</span>
</h1>

          <p className="description">
            A community where women's experiences become shared
            knowledge, helping others recognize risks, find support,
            and navigate their surroundings with greater confidence.
          </p>

          <button
            className="primary-button"
            onClick={() => window.open(
              'https://docs.google.com/document/d/1meVPW7mGAqzqI8m0PxF3MKkliYvZrIQiJLOQ4bK9fcU/edit?usp=sharing',
              '_blank'
            )}
          >
            Share a Safety Report →
          </button>

        </div>


        {/* REVIEWS */}

        <ReviewsCarousel />

      </section>


      {/* STATISTICS */}

      <section className="home-stats" ref={statsRef}>
        <div>
          <h2>
            <AnimatedNumber target={12548} start={showStats} />+
          </h2>
          <p>Community Reports</p>
        </div>

        <div>
          <h2>
            <AnimatedNumber target={8932} start={showStats} />+
          </h2>
          <p>Community Members</p>
        </div>

        <div>
          <h2>
            <AnimatedNumber target={234} start={showStats} />
          </h2>
          <p>Areas Identified</p>
        </div>
      </section>


      {/* FEATURES */}

      <section className="home-features">
        <h2>Your safety, all in one place.</h2>
        <p>Explore the tools that make Firefly possible.</p>

        <div className="feature-row">

          {/* BOX 1: all three tools */}
          <div className="feature-box">
            {features.map((feature) => (
              <div className="feature-item" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <button onClick={() => onNavigate(feature.page)}>
                  {feature.button}
                </button>
              </div>
            ))}
          </div>

          {/* BOX 2: mission + values */}
          <div className="feature-box">
            <div className="feature-item">
              <h3>Our Mission</h3>
              <p>
                Women already carry valuable safety knowledge, but it's
                scattered and hard to find. Firefly brings these experiences
                together through shared reports, community support and
                accessible safety tools.
              </p>
            </div>

            <div className="feature-item">
              <h3>Community</h3>
              <p>Creating spaces where women can support one another.</p>
            </div>

            <div className="feature-item">
              <h3>Awareness</h3>
              <p>Turning shared experiences into meaningful insights.</p>
            </div>

            <div className="feature-item">
              <h3>Action</h3>
              <p>Helping identify areas that need attention and improvement.</p>
            </div>
          </div>

        </div>
      </section>


      {/* COMMUNITY CTA */}

      <section className="home-community">
        <h2>You're not alone.</h2>
        <p>A little light can make a safer world.</p>

        <button
          className="primary-button"
          onClick={() => onNavigate('Community')}
        >
          Meet Your Community →
        </button>
      </section>

    </div>
  );
}


// COMMUNITY PAGE

function CommunityPage() {
  return (
    <section className="content-page">
      <p className="eyebrow">TOGETHER, WE ARE STRONGER</p>

      <h1>
        Your voice. <span>Your community.</span>
      </h1>

      <p className="description">
        A supportive space to share experiences, exchange advice
        and help other women feel less alone.
      </p>

      <button className="primary-button">
        Create a Post +
      </button>

      <div className="community-layout">

        <div className="post-card">
          <div className="post-user">
            <div className="avatar">A</div>
            <div>
              <h3>Anonymous Member</h3>
              <small>2 hours ago</small>
            </div>
          </div>

          <h3>Tips for walking home safely?</h3>

          <p>
            I recently started taking the bus home later in the evening.
            Does anyone have advice for staying aware and feeling safer?
          </p>

          <div className="post-actions">
            <span>♡ 24 Support</span>
            <span>☏ 8 Comments</span>
          </div>
        </div>


        <div className="post-card">
          <div className="post-user">
            <div className="avatar">M</div>
            <div>
              <h3>Anonymous Member</h3>
              <small>5 hours ago</small>
            </div>
          </div>

          <h3>Looking out for each other</h3>

          <p>
            Remember that you deserve to feel comfortable and safe
            in public spaces. Don't hesitate to ask for help.
          </p>

          <div className="post-actions">
            <span>♡ 42 Support</span>
            <span>☏ 12 Comments</span>
          </div>
        </div>

      </div>
    </section>
  );
}


// HEAT MAP PAGE

function HeatMapPage() {
  return (
    <section className="content-page">
      <p className="eyebrow">KNOW YOUR SURROUNDINGS</p>

      <h1>
        Safety <span>Heat Map.</span>
      </h1>

      <p className="description">
        Explore community-reported safety concerns and identify
        areas that may require greater attention.
      </p>

      <div className="heatmap-layout">

        <div className="map-panel">
          <div className="map-label label-one">Riverside Park</div>
          <div className="map-label label-two">Central District</div>
          <div className="map-label label-three">University Area</div>

          <div className="heat heat-one"></div>
          <div className="heat heat-two"></div>
          <div className="heat heat-three"></div>
          <div className="heat heat-four"></div>

          <span className="map-pin pin-one">!</span>
          <span className="map-pin pin-two">!</span>
          <span className="map-pin pin-three">!</span>
          <span className="map-pin pin-four">!</span>
          <span className="map-pin pin-five">!</span>
        </div>

        <div className="map-sidebar">
          <h3>Map Legend</h3>

          <p>
            <span className="legend-dot green"></span>
            Lower reported concerns
          </p>

          <p>
            <span className="legend-dot purple"></span>
            Moderate reported concerns
          </p>

          <p>
            <span className="legend-dot gold"></span>
            Higher reported concerns
          </p>

          <hr />

          <h3>Recent Reports</h3>

          <p>Harassment hotspot</p>
          <small>Central Station · 5h ago</small>

          <p>Unsafe transit stop</p>
          <small>Maple & 8th · 4h ago</small>

          <p>Poor street lighting</p>
          <small>Riverside Park · 6h ago</small>
        </div>

      </div>
    </section>
  );
}


// FIREFLY CHAT PAGE

function ChatPage() {
  return (
    <section className="content-page">
      <p className="eyebrow">HERE WHEN YOU NEED US</p>

      <h1>
        Meet <span>Firefly Chat.</span>
      </h1>

      <p className="description">
        Get practical safety guidance, helpful resources
        and information for navigating uncomfortable situations.
      </p>

      <div className="chat-window">

        <div className="chat-header">
          <span>✦</span>

          <div>
            <h3>Firefly Assistant</h3>
            <small>Your supportive safety companion</small>
          </div>
        </div>

        <div className="chat-messages">

          <div className="bot-message">
            Hi! Welcome to Firefly. How can I help you today?
            You can ask me about personal safety, public spaces
            or finding helpful resources.
          </div>

          <div className="suggestions">
            <button>Walking alone at night</button>
            <button>Public transit safety</button>
            <button>How to report an incident</button>
          </div>

        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask Firefly anything..."
          />

          <button>↑</button>
        </div>

      </div>
    </section>
  );
}


export default App;