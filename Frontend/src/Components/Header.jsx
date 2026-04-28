import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaTrafficLight, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "../theme";

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Parking", path: "/smart-parking" },
  { name: "Navigate", path: "/navigate-me" },
  { name: "Carpool", path: "/carpooling" },
  { name: "Traffic", path: "/check-route" },
  { name: "Auth DB", path: "/auth-database" },
];

const Header = ({ theme = "light", toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const t = tokens[theme];

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) setUser(JSON.parse(userInfo));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  const headerStyles = {
    // Force a background color if menu is open so it looks solid
    background: scrolled || isMobileMenuOpen ? t.bgSurface : "transparent",
    backdropFilter: scrolled || isMobileMenuOpen ? t.backdrop : "none",
    borderBottom: (scrolled || isMobileMenuOpen) ? `1px solid ${t.border}` : "1px solid transparent",
    boxShadow: scrolled ? t.shadowSm : "none",
  };

  return (
    <>
      <header className="app-header" style={headerStyles}>
        <div className="header-container">

          {/* 1. Logo */}
          <Link to="/" className="logo-area">
            <div className="logo-icon" style={{ background: t.gradientPrimary, color: t.textPrimary }}>
              <FaTrafficLight />
            </div>
            <div className="logo-text">
              <span
                key={t.mode}
                className="brand"
                style={{
                  display: "inline-block",
                  color: "#fff",
                  backgroundImage: t.gradientPrimary,
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: "1.2",
                }}
              >
                TrafficOpt
              </span>


            </div>
          </Link>

          {/* 2. Desktop Nav */}
          <nav className="desktop-nav">
            <div className="nav-pill-container" style={{ background: t.bgElevated, border: `1px solid ${t.border}` }}>
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="nav-link"
                    style={{
                      color: isActive ? t.primary : t.textSecondary,
                      background: isActive ? t.gradientSubtle : "transparent",
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* 3. Actions */}
          <div className="actions-area">
            <button onClick={toggleTheme} className="icon-btn" style={{ color: t.textPrimary, border: `1px solid ${t.border}`, background: t.bgCard }}>
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            <div className="desktop-user">
              {user ? (
                <>
                  <div className="user-pill" style={{ border: `1px solid ${t.border}`, background: t.bgCard, color: t.textPrimary }}>
                    <div className="avatar" style={{ background: t.gradientPrimary }}>{user.name?.[0]}</div>
                    <span>{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="icon-btn logout" style={{ color: t.error, border: `1px solid ${t.error}`, background: t.bgCard }}>
                    <FaSignOutAlt />
                  </button>
                </>
              ) : (
                <Link to="/login" className="login-btn" style={{ background: t.gradientPrimary, color: t.textPrimary }}>
                  Sign In
                </Link>
              )}
            </div>

            <button
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: t.textPrimary, background: t.bgCard, border: `1px solid ${t.border}` }}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {/* 4. Mobile Menu (Full Screen Overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="mobile-menu"
            style={{ background: t.bgSurface }}
          >
            <div className="mobile-scroll-container">
              <div className="mobile-nav-list">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="mobile-link"
                    style={{
                      color: location.pathname === item.path ? t.primary : t.textSecondary,
                      background: location.pathname === item.path ? t.gradientSubtle : "transparent",
                      border: location.pathname === item.path ? `1px solid ${t.border}` : "none"
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mobile-auth" style={{ borderTop: `1px solid ${t.border}` }}>
                {user ? (
                  <button onClick={handleLogout} className="mobile-btn logout" style={{ color: t.error, border: `1px solid ${t.error}`, background: t.bgCard }}>
                    <FaSignOutAlt style={{ marginRight: "8px" }} />
                    Logout ({user.name})
                  </button>
                ) : (
                  <Link to="/login" className="mobile-btn login" style={{ background: t.gradientPrimary, color: t.textPrimary }}>
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* --- LAYOUT --- */
        .app-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1100; /* High z-index to stay on top */
          padding: 0.75rem 0;
          transition: all 0.3s ease;
          height: 80px; /* Fixed height for calculations */
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        /* --- COMPONENTS --- */
        .logo-area { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; z-index: 1101; }
        .logo-icon { padding: 0.5rem; border-radius: 12px; display: flex; align-items: center; font-size: 1.25rem; }
        .brand { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; }

        .icon-btn { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s; font-size: 1.1rem; }
        .icon-btn:hover { transform: scale(1.05); }
        
        /* Desktop specific */
        .nav-pill-container { padding: 0.35rem; border-radius: 100px; display: flex; gap: 0.25rem; }
        .nav-link { padding: 0.5rem 1.25rem; text-decoration: none; font-weight: 600; font-size: 0.95rem; border-radius: 20px; transition: all 0.2s; white-space: nowrap; }
        .user-pill { padding: 0.35rem 1rem 0.35rem 0.35rem; border-radius: 30px; display: flex; align-items: center; gap: 0.75rem; font-weight: 600; font-size: 0.9rem; margin-right: 0.5rem; }
        .avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
        .login-btn { padding: 0.6rem 1.5rem; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 0.9rem; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        
        .actions-area { display: flex; align-items: center; gap: 0.75rem; z-index: 1101; }

        /* --- MOBILE MENU & RESPONSIVENESS --- */
        .mobile-toggle { display: none; }
        
        @media (max-width: 900px) {
          .desktop-nav, .desktop-user, .logo-text { display: none; }
          .mobile-toggle { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 12px; cursor: pointer; font-size: 1.2rem; }
          
          /* Full screen mobile menu */
          .mobile-menu {
            position: fixed;
            top: 80px; /* Matches Header Height */
            left: 0;
            right: 0;
            bottom: 0; /* Go to bottom of screen */
            z-index: 1000;
            padding: 1rem;
            display: flex;
            flex-direction: column;
          }
          
          .mobile-scroll-container {
            height: 100%;
            overflow-y: auto;
            padding-bottom: 2rem;
            display: flex;
            flex-direction: column;
          }

          .mobile-nav-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
          .mobile-link { padding: 1rem; text-decoration: none; border-radius: 16px; font-weight: 600; font-size: 1.1rem; display: block; }
          
          .mobile-auth { padding-top: 2rem; margin-top: auto; display: flex; flex-direction: column; gap: 1rem; }
          .mobile-btn { padding: 1rem; border-radius: 16px; text-align: center; font-weight: 700; text-decoration: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
        }
      `}</style>
    </>
  );
};

export default Header;