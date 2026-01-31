import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "LegaloAI",
  description: "AI-powered compliance obligation management for the DPDP Act and beyond."
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="nav">
            <div className="logo">
              <img src="/logo.svg" alt="LegaloAI logo" />
              <div>
                <p className="logo-title">LegaloAI</p>
                <p className="logo-sub">Compliance Intelligence Suite</p>
              </div>
            </div>
            <nav className="nav-links">
              <a href="#platform">Platform</a>
              <a href="#dpdp">DPDP Act</a>
              <a href="#proof">Evidence Vault</a>
              <a className="button" href="/login">Login</a>
            </nav>
          </header>
          {children}
          <footer className="footer">
            <div>
              <h4>LegaloAI</h4>
              <p>Compliance obligations. Evidence. Citations. Ready for audits.</p>
            </div>
            <div>
              <h5>Contact</h5>
              <p>hello@legaloai.com</p>
              <p>+91 98765 43210</p>
            </div>
            <div>
              <h5>Security</h5>
              <p>Role-based access</p>
              <p>Immutable audit trails</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
