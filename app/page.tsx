const HomePage = () => {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="badge">AI-first compliance for modern enterprises</div>
          <h1>Stay audit-ready for the DPDP Act with real-time obligation tracking.</h1>
          <p>
            LegaloAI orchestrates compliance obligations, citations, and evidence artifacts in one
            secure workspace. Automate workflows, map controls to law, and instantly generate audit
            packs.
          </p>
          <div className="hero-actions">
            <a className="button" href="/login">Request a demo</a>
            <button className="ghost">See compliance map</button>
          </div>
          <div className="stats">
            <div>
              <h3>120+</h3>
              <p>DPDP obligations pre-mapped</p>
            </div>
            <div>
              <h3>24/7</h3>
              <p>Evidence collection monitoring</p>
            </div>
            <div>
              <h3>98%</h3>
              <p>Audit readiness confidence</p>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card">
            <h4>Compliance Pulse</h4>
            <p>Real-time obligation health</p>
            <div className="meter">
              <span style={{ width: "82%" }} />
            </div>
            <small>82% obligations verified</small>
          </div>
          <div className="floating-card offset">
            <h4>Evidence Vault</h4>
            <ul>
              <li>DPDP policy v3.pdf</li>
              <li>Consent logs (Q1)</li>
              <li>Risk assessment</li>
            </ul>
          </div>
          <div className="orbit" />
        </div>
      </section>

      <section id="platform" className="section">
        <h2>Everything teams need to operationalize compliance.</h2>
        <div className="grid">
          <div className="card">
            <h3>Obligation Library</h3>
            <p>
              Pre-loaded obligations for the DPDP Act with automated updates, versioning, and
              impact tracking across business units.
            </p>
          </div>
          <div className="card">
            <h3>Controls & Evidence</h3>
            <p>
              Attach policies, logs, and approvals with verifiable evidence chains. Every action is
              time-stamped.
            </p>
          </div>
          <div className="card">
            <h3>Citation Engine</h3>
            <p>
              Map each obligation to the exact statutory citation, clause, and sub-clause so legal
              reviews are instant.
            </p>
          </div>
        </div>
      </section>

      <section id="dpdp" className="section spotlight">
        <div>
          <h2>DPDP Act coverage out-of-the-box.</h2>
          <p>
            LegaloAI ships with a DPDP Act knowledge graph, covering consent management, data
            fiduciary duties, cross-border transfer, and breach response.
          </p>
          <ul className="checklist">
            <li>Consent lifecycle & withdrawal tracking</li>
            <li>Data principal request workflows</li>
            <li>Breach notification timelines</li>
            <li>Risk and DPIA templates</li>
          </ul>
        </div>
        <div className="glass-panel">
          <h4>Compliance Timeline</h4>
          <div className="timeline">
            <div>
              <span>Day 0</span>
              <p>Incident detected</p>
            </div>
            <div>
              <span>Day 1</span>
              <p>Impact assessment</p>
            </div>
            <div>
              <span>Day 2</span>
              <p>Authority notified</p>
            </div>
            <div>
              <span>Day 7</span>
              <p>Closure & remediation</p>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="section">
        <h2>Evidence-ready for regulators, clients, and investors.</h2>
        <div className="grid three">
          <div className="card">
            <h3>Audit Packs</h3>
            <p>Export compliance evidence in minutes with curated audit bundles.</p>
          </div>
          <div className="card">
            <h3>Task Automation</h3>
            <p>Assign owners, due dates, and reminders with auto-escalations.</p>
          </div>
          <div className="card">
            <h3>Real-time Insights</h3>
            <p>Dashboards with risk heatmaps, overdue obligations, and compliance KPIs.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
