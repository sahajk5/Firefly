
import { useState } from 'react';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('Home');

  const pages = ['Home', 'Heat Map', 'Firefly Chat', 'Community', 'About'];

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

    if (activePage === 'About') {
      return <AboutPage />;
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
        <p>✦ Firefly — A little light goes a long way.</p>
      </footer>

    </div>
  );
}


// HOME PAGE

function HomePage({ onNavigate }) {
  return (
    <div className="home-page">

      <section className="home-welcome">
        <div>
          <p className="eyebrow">A COMMUNITY THAT LOOKS OUT FOR YOU</p>

          <h1>
            Real women.<br />
            Real experiences.<br />
            <span>Safer spaces.</span>
          </h1>

          <p className="description">
            Together, we turn shared experiences into awareness,
            support and safer communities.
          </p>

          <button
            className="primary-button"
            onClick={() => onNavigate('Heat Map')}
          >
            Explore Safety Map →
          </button>
        </div>

        <div className="welcome-decoration">✦</div>
      </section>

      <section className="home-stats">
        <div>
          <h2>12,548</h2>
          <p>Community Reports</p>
        </div>
        <div>
          <h2>8,932</h2>
          <p>Community Members</p>
        </div>
        <div>
          <h2>234</h2>
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
            <p>Discover community-reported safety concerns in different areas.</p>
            <button onClick={() => onNavigate('Heat Map')}>
              Explore Map →
            </button>
          </div>

          <div className="feature-card">
            <span>♡</span>
            <h3>Community</h3>
            <p>Share experiences, exchange advice and support one another.</p>
            <button onClick={() => onNavigate('Community')}>
              Join Community →
            </button>
          </div>

          <div className="feature-card">
            <span>✧</span>
            <h3>Firefly Chat</h3>
            <p>Find guidance and practical safety information when you need it.</p>
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


// COMMUNITY PAGE

function CommunityPage() {
  return (
    <section className="content-page">
      <p className="eyebrow">TOGETHER, WE ARE STRONGER</p>
      <h1>Your voice. <span>Your community.</span></h1>
      <p className="description">
        A supportive space to share experiences, exchange advice
        and help other women feel less alone.
      </p>

      <button className="primary-button">Create a Post +</button>

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
      <h1>Safety <span>Heat Map.</span></h1>
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
          <p><span className="legend-dot green"></span> Lower reported concerns</p>
          <p><span className="legend-dot purple"></span> Moderate reported concerns</p>
          <p><span className="legend-dot gold"></span> Higher reported concerns</p>

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
      <h1>Meet <span>Firefly Chat.</span></h1>
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

      <h1>A little light can make a <span>safer world.</span></h1>

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
    </section>
  );
}

export default App;
