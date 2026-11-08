import HeatmapView from './heatmap/HeatmapPage';
import { useState, useEffect, useRef } from 'react';
import './App.css';
import CommunityPage from './Community.jsx';
import logo from './assets/firefly-logo.svg';

function App() {
  const [activePage, setActivePage] = useState('Home');

  const pages = ['Home', 'Heat Map', 'Firefly Chat', 'Community', 'About'];

  function renderPage() {
    if (activePage === 'Home') {
      return <HomePage onNavigate={setActivePage} />;
    }

    if (activePage === 'Community') {
      return <CommunityPage onNavigate={setActivePage} />;
    }

    if (activePage === 'Heat Map') {
      return <HeatMapPage />;
    }

    if (activePage === 'Firefly Chat') {
      return <ChatPage />;
    }

    if (activePage === 'About') {
      return <AboutPage />;
    }
  }

  return (
    <div className="dashboard">

      <nav className="navbar">
        <div className="logo">
          <img
            src={logo}
            alt=""
            width="44"
            height="44"
            style={{ display: 'block', flexShrink: 0 }}
          />
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
        <p>✦ Firefly — A little light goes a long way.</p>
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

      <section className="home-welcome">
        <div>
          <p className="eyebrow">
            LIGHT THE WAY. LOOK OUT FOR EACH OTHER.
          </p>

          <h1>
            Your Experiences<br />
            Can Light the Way<br />
            to <span>Safety.</span>
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

        <div className="welcome-decoration">✦</div>
      </section>


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


      <section className="home-features">
        <h2>Your safety, all in one place.</h2>
        <p>Explore the tools that make Firefly possible.</p>

        <div className="feature-grid">

          <div className="feature-card">
            <span>⌖</span>
            <h3>Safety Heat Map</h3>
            <p>
              Discover community-reported safety concerns in different areas.
            </p>
            <button onClick={() => onNavigate('Heat Map')}>
              Explore Map →
            </button>
          </div>

          <div className="feature-card">
            <span>♡</span>
            <h3>Community</h3>
            <p>
              Share experiences, exchange advice and support one another.
            </p>
            <button onClick={() => onNavigate('Community')}>
              Join Community →
            </button>
          </div>

          <div className="feature-card">
            <span>✧</span>
            <h3>Firefly Chat</h3>
            <p>
              Find guidance and practical safety information when you need it.
            </p>
            <button onClick={() => onNavigate('Firefly Chat')}>
              Start Chatting →
            </button>
          </div>

        </div>
      </section>


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

      <div style={{ marginTop: '35px' }}>
        <HeatmapView />
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


// ABOUT PAGE

function AboutPage() {
  return (
    <section className="content-page about-page">

      <p className="eyebrow">THE STORY BEHIND FIREFLY</p>

      <h1>
        A little light can make a <span>safer world.</span>
      </h1>

      <p className="description">
        Firefly is a community-driven women's safety platform
        designed to make women safer, more confident and better informed.
      </p>


      <div className="about-card">
        <h2>Our Mission</h2>

        <p>
          Women already carry valuable safety knowledge: which bus
          stop feels unsafe after dark, which streets are poorly lit
          and which spaces make them uncomfortable. But this knowledge
          is often scattered and difficult to access.
        </p>

        <p>
          Firefly brings these experiences together through shared
          reports, community support and accessible safety tools.
        </p>
      </div>


      <div className="about-values">

        <div>
          <span>♡</span>
          <h3>Community</h3>
          <p>Creating spaces where women can support one another.</p>
        </div>

        <div>
          <span>✦</span>
          <h3>Awareness</h3>
          <p>Turning shared experiences into meaningful insights.</p>
        </div>

        <div>
          <span>⌖</span>
          <h3>Action</h3>
          <p>Helping identify areas that need attention and improvement.</p>
        </div>

      </div>


      {/* COMMUNITY SAFETY REPORT */}

      <div className="report-section">

        <p className="eyebrow">OUR COMMUNITY, OUR STORIES</p>

        <h2>Firefly Community Safety Report</h2>

        <p className="description">
          Explore our community safety report and discover how
          shared experiences can help create safer spaces.
        </p>

        <div className="report-document">
          <iframe
            src="https://docs.google.com/document/d/1meVPW7mGAqzqI8m0PxF3MKkliYvZrIQiJLOQ4bK9fcU/preview"
            width="100%"
            height="800"
            title="Firefly Community Safety Report"
            style={{
              border: 'none',
              borderRadius: '12px'
            }}
          ></iframe>
        </div>

        <button
          className="primary-button"
          onClick={() => window.open(
            'https://docs.google.com/document/d/1meVPW7mGAqzqI8m0PxF3MKkliYvZrIQiJLOQ4bK9fcU/edit?usp=sharing',
            '_blank'
          )}
        >
          Open Full Report →
        </button>

      </div>

    </section>
  );
}


export default App;