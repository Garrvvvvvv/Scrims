  import React, { useState } from "react";
  import { Link, useLocation } from "react-router-dom"; // Import useLocation
  import { auth } from "../firebase"; // Assuming firebase.js is correctly configured
  import { useAuthState } from "react-firebase-hooks/auth";

  const Navbar = () => {
    const [user] = useAuthState(auth);
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
      auth.signOut();
      setMenuOpen(false); // Close menu on logout
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
      { to: "/home", label: "Home", icon: "🏠" },
      { to: "/register", label: "Register", icon: "📝" },
      { to: "/slots", label: "Slot List", icon: "⏰" },
    ];

    // List of authorized admin emails
    const ADMIN_EMAILS = ["admin@example.com"]; // Replace with your admin emails

    // Add Admin Portal link if user is admin
    if (user && ADMIN_EMAILS.includes(user.email)) {
      navLinks.push({ to: "/admin", label: "Admin Portal", icon: "⚙️" });
    }

    // Close menu on link click (mobile)
    const handleLinkClick = () => {
      if (menuOpen) setMenuOpen(false);
    };

    return (
      <div
        style={{
          position: "relative",
          zIndex: 1000,
        }}
      >
        {/* Geometric background patterns for navbar */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: "5%",
              width: "40px",
              height: "40px",
              background:
                "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              animation: "rotate 20s linear infinite",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "60%",
              left: "10%",
              width: "30px",
              height: "30px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              animation: "rotate 15s linear infinite reverse",
            }}
          ></div>
        </div>
        <nav
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
            backdropFilter: "blur(20px)",
            padding: "0 1.5rem", // Adjusted padding for better mobile fit
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            height: "80px",
            borderBottom: "4px solid transparent",
            borderImage: "linear-gradient(90deg, #006064, #00838f, #0097a7, #00acc1) 1",
            position: "relative",
            boxShadow: "0 8px 32px rgba(0, 96, 100, 0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            zIndex: 10,
            maxWidth: '1400px', // Max width for larger screens
            margin: '0 auto', // Center the navbar
          }}
        >
          {/* Logo Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              userSelect: "none",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                background: "linear-gradient(135deg, #006064, #00838f)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                boxShadow: "0 8px 16px rgba(0, 96, 100, 0.3)",
                position: "relative",
                overflow: "hidden",
                color: "white",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-50%",
                  right: "-50%",
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
                  borderRadius: "50%",
                }}
              ></div>
              <span style={{ position: "relative", zIndex: 1 }}>🏢</span>
            </div>
            <div>
              <h1
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #006064, #00838f)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0,
                  letterSpacing: "0.02em",
                }}
              >
                Mavericks Esports
              </h1>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#00838f",
                  margin: 0,
                  fontWeight: "600",
                  opacity: 0.8,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Paid Practice Scrims 
              </p>
            </div>
          </div>
          {/* Hamburger - visible only on mobile/tablet via CSS */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              flexDirection: "column",
              justifyContent: "center",
              gap: "5px",
              width: "30px",
              height: "25px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              marginLeft: "1rem",
              zIndex: 20,
            }}
            id="hamburger-btn"
          >
            <span
              style={{
                display: "block",
                height: "3px",
                backgroundColor: "#006064",
                borderRadius: "3px",
                transition: "all 0.3s",
                transformOrigin: "1px",
                transform: menuOpen ? "rotate(45deg)" : "none",
                position: "relative",
              }}
            ></span>
            <span
              style={{
                display: "block",
                height: "3px",
                backgroundColor: "#006064",
                borderRadius: "3px",
                transition: "all 0.3s",
                opacity: menuOpen ? 0 : 1,
                position: "relative",
              }}
            ></span>
            <span
              style={{
                display: "block",
                height: "3px",
                backgroundColor: "#006064",
                borderRadius: "3px",
                transition: "all 0.3s",
                transformOrigin: "1px",
                transform: menuOpen ? "rotate(-45deg)" : "none",
                position: "relative",
              }}
            ></span>
          </button>
          {/* Navigation Links Container */}
          <div
            style={{
              alignItems: "center",
              height: "100%",
              gap: "0.5rem",
              userSelect: "none",
            }}
            id="navbar-links"
          >
            {/* Mobile Menu - visibility controlled by CSS and menuOpen state */}
            <div
              style={{
                flexDirection: "column",
                position: "absolute",
                top: "80px",
                left: "0", // Adjusted to align with navbar edge
                right: "0", // Adjusted to align with navbar edge
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
                backdropFilter: "blur(20px)",
                padding: "1rem 1.5rem", // Adjusted padding for mobile links
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
                boxShadow: "0 8px 32px rgba(0, 96, 100, 0.1)",
                zIndex: 15,
                maxHeight: menuOpen ? '300px' : '0', // Smooth slide animation
                overflow: 'hidden', // Hide overflow during animation
                transition: 'max-height 0.3s ease-out, padding 0.3s ease-out', // Smooth transition
              }}
              className="mobile-menu"
            >
              {navLinks
                .filter((link) => !link.requiresAuth || user)
                .map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={handleLinkClick}
                    style={{
                      color: isActive(link.to) ? "#fff" : "#006064",
                      textDecoration: "none",
                      fontSize: "1rem",
                      padding: "0.8rem 1rem", // Adjusted padding for mobile links
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontWeight: 600,
                      borderRadius: "12px",
                      background: isActive(link.to)
                        ? "linear-gradient(135deg, #006064, #00838f)"
                        : "transparent",
                      boxShadow: isActive(link.to)
                        ? "0 8px 16px rgba(0, 96, 100, 0.3)"
                        : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
                    color: "#006064",
                    border: "2px solid transparent",
                    borderImage: "linear-gradient(135deg, #00838f, #0097a7) 1",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginTop: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 12px rgba(0, 131, 143, 0.3)",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #006064, #00838f)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0, 96, 100, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))";
                    e.currentTarget.style.color = "#006064";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 96, 100, 0.1)";
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>🚪</span>
                  <span style={{ letterSpacing: "0.02em" }}>Logout</span>
                </button>
              )}
            </div>
            {/* Desktop Menu - visibility controlled by CSS */}
            <div
              style={{
                alignItems: "center",
                gap: "0.5rem",
                userSelect: "none",
                height: "100%",
              }}
              className="desktop-menu"
            >
              {navLinks
                .filter((link) => !link.requiresAuth || user)
                .map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={handleLinkClick}
                    style={{
                      color: isActive(link.to) ? "#fff" : "#006064",
                      textDecoration: "none",
                      fontSize: "1rem",
                      padding: "0.8rem 1.5rem",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      position: "relative",
                      fontWeight: "600",
                      border: "none",
                      background: isActive(link.to)
                        ? "linear-gradient(135deg, #006064, #00838f)"
                        : "transparent",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: isActive(link.to)
                        ? "0 8px 16px rgba(0, 96, 100, 0.3)"
                        : "none",
                      transform: isActive(link.to)
                        ? "translateY(-2px)"
                        : "translateY(0)",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(link.to)) {
                        e.currentTarget.style.background = "rgba(0, 131, 143, 0.1)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0, 96, 100, 0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(link.to)) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    {isActive(link.to) && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background:
                            "linear-gradient(45deg, rgba(255,255,255,0.1), transparent)",
                          borderRadius: "12px",
                        }}
                      ></div>
                    )}
                    <span
                      style={{ fontSize: "1.1rem", position: "relative", zIndex: 1 }}
                    >
                      {link.icon}
                    </span>
                    <span
                      style={{
                        position: "relative",
                        zIndex: 1,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {link.label}
                    </span>
                    {isActive(link.to) && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-2px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "80%",
                          height: "3px",
                          background:
                            "linear-gradient(90deg, #00acc1, #26c6da)",
                          borderRadius: "2px",
                          animation: "slideIn 0.3s ease-out",
                        }}
                      ></div>
                    )}
                  </Link>
                ))}
              {user && (
                <button
                  onClick={handleLogout}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
                    color: "#006064",
                    border: "2px solid transparent",
                    borderImage: "linear-gradient(135deg, #00838f, #0097a7) 1",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 12px rgba(0, 96, 100, 0.1)",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #006064, #00838f)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0, 96, 100, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))";
                    e.currentTarget.style.color = "#006064";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 96, 100, 0.1)";
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>🚪</span>
                  <span style={{ letterSpacing: "0.02em" }}>Logout</span>
                </button>
              )}
            </div>
          </div>
        </nav>
        <style jsx>{`
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes slideIn {
            from { width: 0; opacity: 0; }
            to { width: 80%; opacity: 1; }
          }
          /* MEDIA QUERIES */
          @media (max-width: 768px) {
            /* Adjust main navbar padding for smaller screens */
            nav {
              padding: 0 1rem !important;
            }
            /* Show hamburger button */
            button#hamburger-btn {
              display: flex !important;
            }
            /* Hide desktop menu */
            #navbar-links .desktop-menu { /* Target desktop menu inside navbar-links */
              display: none !important;
            }
            /* Mobile menu specific styles */
            #navbar-links .mobile-menu { /* Target mobile menu inside navbar-links */
              display: flex !important; /* Always flex on mobile, visibility controlled by maxHeight */
              width: calc(100% - 2rem) !important; /* Account for main navbar padding */
              left: 1rem !important; /* Align with main navbar padding */
              right: 1rem !important;
              padding: 1rem !important; /* More compact padding for mobile links */
            }
            #navbar-links .mobile-menu a, #navbar-links .mobile-menu button {
              width: 100%; /* Full width links/buttons in mobile menu */
              justify-content: flex-start; /* Align content to start */
            }
          }
          @media (min-width: 769px) {
            /* Hide hamburger button */
            button#hamburger-btn {
              display: none !important;
            }
            /* Show desktop menu */
            #navbar-links .desktop-menu { /* Target desktop menu inside navbar-links */
              display: flex !important;
            }
            /* Hide mobile menu */
            #navbar-links .mobile-menu { /* Target mobile menu inside navbar-links */
              display: none !important;
            }
          }
        `}</style>
      </div>
    );
  };

  export default Navbar;
