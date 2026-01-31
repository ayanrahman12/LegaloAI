const DashboardPage = () => {
  return (
    <main className="section">
      <div className="dashboard-header">
        <div>
          <h1>Compliance Command Center</h1>
          <p>Unified view of obligations, evidence, and citations.</p>
        </div>
        <button className="button">Generate audit pack</button>
      </div>
      <div className="grid three">
        <div className="card">
          <h3>Open Obligations</h3>
          <p className="metric">18</p>
          <span>4 due this week</span>
        </div>
        <div className="card">
          <h3>Evidence Items</h3>
          <p className="metric">256</p>
          <span>Synced from 6 systems</span>
        </div>
        <div className="card">
          <h3>Citations</h3>
          <p className="metric">143</p>
          <span>Mapped to DPDP 2023</span>
        </div>
      </div>
      <div className="grid">
        <div className="card">
          <h3>High-risk obligations</h3>
          <ul className="list">
            <li>Consent withdrawal SLA</li>
            <li>Breach notification timeline</li>
            <li>Data minimization controls</li>
          </ul>
        </div>
        <div className="card">
          <h3>Upcoming reviews</h3>
          <ul className="list">
            <li>Quarterly DPIA refresh</li>
            <li>Vendor compliance review</li>
            <li>Cross-border transfer assessment</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
