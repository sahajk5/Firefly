
import './App.css';

function App() {
  return (
    <div className="website">
      <nav className="navbar">
        <div className="logo">✦ Firefly</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#heatmap">Safety Heatmap</a>
          <a href="#chatbot">AI Chatbot</a>
          <a href="#community">Community</a>
        </div>

        <button className="nav-button">Join Firefly</button>
      </nav>

      <main id="home" className="hero">
        <p className="eyebrow">A COMMUNITY THAT LOOKS OUT FOR YOU</p>

        <h1>
          A little light can
          <br />
          make a <span>safer world.</span>
        </h1>

        <p className="hero-description">
          A community-driven women's safety platform that transforms
          shared experiences into collective awareness and action.
        </p>

        <button className="primary-button">
          Report an Incident →
        </button>

        <div className="stats">
          <div>
            <h2>--</h2>
            <p>Verified Reports</p>
          </div>
          <div>
            <h2>--</h2>
            <p>Community Members</p>
          </div>
          <div>
            <h2>--</h2>
            <p>Areas Improved</p>
          </div>
        </div>
      </main>

      <section id="heatmap" className="feature-section">
        <h2>Your city. Your community. Your safety.</h2>
        <p>Explore community-reported safety concerns through our Safety Heatmap.</p>
      </section>

      <section id="chatbot" className="feature-section">
        <h2>Guidance when you need it.</h2>
        <p>Get practical, situation-specific safety guidance with our AI assistant.</p>
      </section>

      <section id="community" className="community-section">
        <h2>You're not alone.</h2>
        <p>Connect with other women to share experiences and keep each other safe.</p>
        <button className="primary-button">Explore the Community →</button>
      </section>

      <footer>
        <p>✦ Firefly — A little light goes a long way.</p>
      </footer>
    </div>
  );
}

export default App;
