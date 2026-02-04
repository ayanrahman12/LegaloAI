const LoginPage = () => {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Welcome back to LegaloAI</h1>
        <p>Sign in to access your compliance command center.</p>
        <form className="auth-form">
          <label>
            Work Email
            <input type="email" placeholder="name@company.com" required />
          </label>
          <label>
            Password
            <input type="password" placeholder="••••••••" required />
          </label>
          <button className="button" type="submit">Sign in</button>
        </form>
        <div className="auth-footer">
          <span>Need access?</span>
          <button className="ghost" type="button">Request invite</button>
        </div>
      </div>
      <div className="auth-side">
        <h2>Compliance never sleeps.</h2>
        <p>
          Track DPDP obligations, capture evidence, and keep every stakeholder audit-ready.
        </p>
        <div className="orbit small" />
      </div>
    </main>
  );
};

export default LoginPage;
