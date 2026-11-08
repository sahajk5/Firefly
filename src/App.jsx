import './App.css';

function App() {
  return (
    <div className="dashboard">

      {/* Top navigation */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">✦</span>
          <div>
            <h2>Firefly</h2>
            <p>Real Reports. Safer Communities.</p>
          </div>
        </div>

        <div className="nav-links">
          <a href="#map">Map</a>
          <a href="#report">Report</a>
          <a href="#community">Community</a>
          <a href="#tools">Safety Tools</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-right">
          <div className="search">⌕ <span>Search location...</span></div>
          <span className="notification">♧</span>
          <div className="profile">F</div>
        </div>
      </nav>

      {/* Main dashboard */}
      <main className="main-grid">

        {/* Left introduction */}
        <section className="intro">
          <h1>
            Real women.<br />
            Real experiences.<br />
            <span>Safer spaces.</span>
          </h1>

          <p>Verified safety reports and community insights.</p>

          <button className="report-button" id="report">
            ✎ &nbsp; Report an Incident
          </button>

          <div className="stats">
            <div>
              <h2>12,548</h2>
              <p>Verified Reports</p>
            </div>
            <div>
              <h2>8,932</h2>
              <p>Active Users</p>
            </div>
            <div>
              <h2>234</h2>
              <p>Areas Improved</p>
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="map-panel" id="map">
          <div className="map-search">⌕ &nbsp; Your location <span>›</span></div>

          <div className="map-label label-one">Riverside Park</div>
          <div className="map-label label-two">Central Office Park</div>
          <div className="map-label label-three">Central Central</div>
          <div className="map-label label-four">Riverdale Park</div>

          <div className="heat heat-one"></div>
          <div className="heat heat-two"></div>
          <div className="heat heat-three"></div>
          <div className="heat heat-four"></div>
          <div className="heat heat-five"></div>

          <span className="map-pin pin-one">!</span>
          <span className="map-pin pin-two">!</span>
          <span className="map-pin pin-three">!</span>
          <span className="map-pin pin-four">!</span>
          <span className="map-pin pin-five">!</span>
          <span className="map-pin pin-six">!</span>
          <span className="map-pin pin-seven">!</span>
          <span className="map-pin pin-eight">!</span>
          <span className="map-pin pin-nine">!</span>
          <span className="map-pin pin-ten">!</span>

          <div className="map-controls">
            <button>+</button>
            <button>⌖</button>
            <button>➤</button>
          </div>
        </section>

        {/* Heatmap legend */}
        <section className="legend-panel">
          <h3>Safety Heatmap</h3>
          <div className="gradient-bar"></div>
          <div className="risk-labels">
            <span>Lower risk</span>
            <span>Higher risk</span>
          </div>

          <div className="legend-item"><span className="legend-icon yellow">!</span> Harassment hotspot</div>
          <div className="legend-item"><span className="legend-icon purple">●</span> Unsafe transit stop</div>
          <div className="legend-item"><span className="legend-icon gold">▤</span> Problem workplace</div>
          <div className="legend-item"><span className="legend-icon green">✓</span> Verified report</div>
        </section>

        {/* Recent reports */}
        <section className="recent-panel">
          <div className="section-heading">
            <h3>Recent Verified Reports</h3>
            <a href="#reports">View all →</a>
          </div>

          <div className="recent-report">
            <span className="report-icon yellow">!</span>
            <div>
              <h4>Harassment hotspot</h4>
              <p>Central Station</p>
              <p>A group of men often stand and follow women on the south side after dark.</p>
              <small>5h ago</small>
              <span className="verified">✓ Verified</span>
            </div>
          </div>

          <div className="recent-report">
            <span className="report-icon blue">●</span>
            <div>
              <h4>Unsafe transit stop</h4>
              <p>Maple & 8th (Bus Stop)</p>
              <p>Poor lighting, frequent loitering, and an unsafe walking area at night.</p>
              <small>4h ago</small>
              <span className="verified">✓ Verified</span>
            </div>
          </div>

          <div className="recent-report">
            <span className="report-icon gold">▤</span>
            <div>
              <h4>Problem workplace</h4>
              <p>Riverside Office Park</p>
              <p>Manager makes inappropriate comments and creates a hostile environment.</p>
              <small>6h ago</small>
              <span className="verified">✓ Verified</span>
            </div>
          </div>
        </section>

        {/* Bottom cards */}
        <section className="insights-card">
          <h3>↗ &nbsp; Safety Insights</h3>
          <h4>Top reported areas this month</h4>

          {[
            ['Central Station', '82%'],
            ['Maple & 8th', '65%'],
            ['Riverside Office Park', '55%'],
            ['West End', '42%'],
            ['University District', '34%']
          ].map((place, index) => (
            <div className="insight-row" key={place[0]}>
              <span className="rank">{index + 1}</span>
              <div className="insight-content">
                <p>{place[0]}</p>
                <div className="progress">
                  <div style={{ width: place[1] }}></div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="example-card">
          <h3>Example Report</h3>
          <div className="anonymous">
            <div className="avatar">A</div>
            <div>
              <h4>Anonymous</h4>
              <small>2 hours ago</small>
            </div>
          </div>
          <div className="stars">★★★★★</div>
          <p>
            I was walking home around 8:30 PM and a man started following me.
            I said something and kept getting closer. I had to take a different
            route to get away. This happens often near the station.
          </p>
          <div className="report-tags">
            <span>● Harassment hotspot</span>
            <span>⌖ Central Station</span>
          </div>
        </section>

        <section className="impact-card" id="about">
          <h3>♢ &nbsp; Safety for a Stronger Tomorrow</h3>
          <p>
            Verified reports help community organizations and local
            authorities identify problem areas and take action — from
            better lighting to increased patrols and safer transit.
          </p>
          <button>View Community Impact →</button>

          <div className="impact-icons">
            <span>♙<small>Police</small></span>
            <span>♧<small>City Officials</small></span>
            <span>▣<small>Transit</small></span>
            <span>♧<small>Community</small></span>
          </div>
        </section>

        <section className="community-card" id="community">
          <div>
            <h2>You're not alone.</h2>
            <h3>Join our community.</h3>
            <p>◇ &nbsp; Share experiences</p>
            <p>◇ &nbsp; Get advice</p>
            <p>◇ &nbsp; Support other women</p>
            <button>Go to Community →</button>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;