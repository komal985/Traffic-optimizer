import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHeart, FaGithub, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import { tokens } from "../theme";

const Footer = ({ theme }) => {
  const t = tokens[theme];

  const developerNames = [
    { name: "Komal Kumari", github: "" },
    { name: "Kanak Mittal", github: "" },
    { name: "Kavish Gupta", github: "" },
    { name: "Jhanvi Varshney", github: "" },
  ];

  const SocialIcon = ({ icon, href }) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3, color: t.primary }}
      style={{
        color: t.textMuted,
        fontSize: '1.25rem',
        transition: 'color 0.2s',
        display: 'inline-flex'
      }}
    >
      {icon}
    </motion.a>
  );

  return (
    <footer style={{
      backgroundColor: t.bgElevated, // Layer 2 background
      borderTop: `1px solid ${t.border}`,
      padding: "4rem 0 2rem",
      marginTop: "auto",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Optional: Glow effect for consistency */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '1px',
        background: `radial-gradient(circle, ${t.primary} 0%, transparent 100%)`,
        opacity: 0.3
      }} />

      <Container>
        <Row className="gy-4">
          {/* Brand Column */}
          <Col lg={4}>
            <h5 style={{
              fontWeight: 700,
              color: t.textPrimary,
              marginBottom: '1rem',
              letterSpacing: '-0.5px'
            }}>
              TrafficOptimizer
            </h5>
            <p style={{ color: t.textSecondary, lineHeight: 1.6, maxWidth: '300px' }}>
              Revolutionizing urban mobility with AI-driven traffic solutions. Smart parking, route optimization, and real-time analytics.
            </p>
            <div className="d-flex gap-3 mt-3">
              <SocialIcon icon={<FaGithub />} />
              <SocialIcon icon={<FaLinkedin />} />
              <SocialIcon icon={<FaTwitter />} />
            </div>
          </Col>

          {/* Links Column */}
          <Col lg={4}>
            <h6 style={{ color: t.textPrimary, fontWeight: 600, marginBottom: '1.5rem' }}>Quick Navigation</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[
                { name: "Dashboard", path: "/dashboard" },
                { name: "Smart Parking", path: "/smart-parking" },
                { name: "Navigate Me", path: "/navigate-me" },
                { name: "Carpooling", path: "/carpooling" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    style={{
                      color: t.textSecondary,
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = t.primary}
                    onMouseLeave={(e) => e.target.style.color = t.textSecondary}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Credits Column */}
          <Col lg={4}>
            <h6 style={{ color: t.textPrimary, fontWeight: 600, marginBottom: '1.5rem' }}>Contributors</h6>
            <div className="d-flex flex-column gap-3">
              {developerNames.map((dev, idx) => (
                <div key={idx} className="d-flex align-items-center gap-3">
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: t.bgCard,
                    border: `1px solid ${t.border}`,
                    color: t.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    {dev.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ color: t.textPrimary, fontWeight: 500, fontSize: '0.95rem' }}>{dev.name}</div>
                    {(dev.github || dev.linkedin) && (
                      <div className="d-flex gap-2" style={{ fontSize: '0.8rem' }}>
                        {dev.github && (
                          <a href={dev.github} target="_blank" rel="noreferrer" style={{ color: t.textMuted, textDecoration: 'none' }}>GitHub</a>
                        )}
                        {dev.linkedin && (
                          <>
                            {dev.github && <span style={{ color: t.border }}>•</span>}
                            <a href={dev.linkedin} target="_blank" rel="noreferrer" style={{ color: t.textMuted, textDecoration: 'none' }}>LinkedIn</a>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${t.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ color: t.textMuted, fontSize: '0.85rem', margin: 0 }}>
            © {new Date().getFullYear()} TrafficOptimizer. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: t.textMuted, fontSize: '0.85rem' }}>
            Made with <FaHeart color="#ef4444" size={14} /> in Delhi
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
