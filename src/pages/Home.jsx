import React, { useState } from "react";
import SlideShow from "../pages/SlideShow";

const mockSlideshowImages = [
  { src: "/images/post1.jpg", alt: "Scrims Poster 1" },
  { src: "/images/post2.jpg", alt: "Scrims Poster 2" },
  { src: "/images/post3.jpg", alt: "Scrims Poster 3" },
];


const features = [
  { icon: "⚡", title: "Lightning-Fast Matchmaking", description: "Get into competitive scrims quickly with our efficient matchmaking system." },
  { icon: "🏆", title: "Fair & Balanced Teams", description: "Our algorithm ensures balanced teams for a truly competitive experience." },
  { icon: "📈", title: "Detailed Performance Stats", description: "Track your progress with in-depth statistics after every scrim." },
  { icon: "🤝", title: "Vibrant Community", description: "Join a thriving community of dedicated players and find your perfect team." },
  { icon: "🛡️", title: "Anti-Cheat Measures", description: "We employ robust anti-cheat systems to ensure fair play for everyone." },
  { icon: "🎁", title: "Exclusive Rewards", description: "Participate in special events and earn exclusive in-game rewards." },
];

const rules = [
  "All participants must adhere to fair play guidelines. Cheating or exploiting bugs will result in immediate disqualification and ban.",
  "Respect all players and staff. Harassment, hate speech, or any form of discrimination is strictly prohibited.",
  "Ensure stable internet connection. Disconnections due to personal internet issues will not result in match restarts.",
  "Follow the designated time slots. Late arrivals may result in forfeiture of your slot.",
  "All team names and player names must be appropriate and non-offensive.",
  "Decisions made by administrators are final. Any disputes should be raised respectfully through official channels.",
  "Recording and streaming of scrims are allowed, but please be mindful of other players' privacy.",
  "Any form of account sharing or boosting is forbidden.",
];

const HomePage = () => {
  const [slideshowImages] = useState(mockSlideshowImages);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #e0f7fa 0%, #b2ebf2 25%, #80deea 50%, #4dd0e1 75%, #26c6da 100%)",
        padding: "1.5rem",
        position: "relative",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* Optional: Add decorative geometric background divs here as you like */}

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative" }}>
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "900",
              background: "linear-gradient(135deg, #006064, #00838f, #0097a7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
              letterSpacing: "0.1em",
              textShadow: "0 0 30px rgba(0, 96, 100, 0.3)",
            }}
          >
            WELCOME TO
            <span style={{ color: "#4dd0e1" }}> SCRIMS</span>
          </h1>
          <p
            style={{
              fontSize: "1.3rem",
              color: "#006064",
              fontWeight: "600",
              marginTop: "1rem",
              opacity: 0.9,
            }}
          >
            Your Ultimate Destination for Competitive Gaming
          </p>
        </div>

        {/* Slideshow Section */}
        <div style={{ marginBottom: "3rem" }}>
          <SlideShow images={slideshowImages} />
        </div>

        {/* Features Section */}
        <div
          style={{
            marginBottom: "3rem",
            background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "2.5rem",
            boxShadow: "0 25px 50px rgba(0,96,100,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #006064, #00838f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Why Our Scrims?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,248,255,0.8))",
                  border: "1px solid rgba(0,131,143,0.2)",
                  borderRadius: "16px",
                  boxShadow: "0 8px 24px rgba(0,96,100,0.08)",
                  padding: "1.5rem",
                  textAlign: "center",
                  cursor: "default",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{feature.icon}</div>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    color: "#006064",
                    marginBottom: "0.5rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: "0.95rem", color: "#00838f", opacity: 0.8 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rules Section */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            padding: "2.5rem",
            boxShadow: "0 25px 50px rgba(0,96,100,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #006064, #00838f)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Rules & Regulations
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {rules.map((rule, index) => (
              <li
                key={index}
                style={{
                  background: "rgba(0,131,143,0.05)",
                  borderLeft: "4px solid #00838f",
                  borderRadius: "8px",
                  padding: "1rem 1.5rem",
                  fontSize: "1rem",
                  color: "#006064",
                  fontWeight: "500",
                  boxShadow: "0 4px 12px rgba(0,96,100,0.05)",
                }}
              >
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
