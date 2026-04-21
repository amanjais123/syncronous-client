import React from "react";
import AppLayout from "../components/layout/AppLayout";

const Home = () => {
  return (
    <div className="home-empty">
      {/* Animated Logo */}
      <div className="home-empty-logo">
        <svg width="44" height="44" viewBox="0 0 78 32" fill="none">
          <path d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z" fill="rgba(255,255,255,0.95)" />
          <path d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z" fill="rgba(255,255,255,0.7)" />
          <path d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z" fill="rgba(255,255,255,0.45)" />
        </svg>
      </div>

      <div>
        <h3>Welcome to Syncronous</h3>
        <p style={{ marginTop: "0.5rem" }}>Select a conversation to start messaging</p>
      </div>

      {/* Tips */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        marginTop: "0.5rem",
        width: "100%",
        maxWidth: 320,
      }}>
        {[
          { emoji: "🔍", text: "Search for people using the search icon" },
          { emoji: "✉️", text: "Start a new group with the + button" },
          { emoji: "🔔", text: "View friend requests in notifications" },
        ].map(({ emoji, text }, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "#f2f3ff",
              borderRadius: 12,
              padding: "0.75rem 1rem",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>{emoji}</span>
            <span style={{ fontSize: "0.875rem", color: "#464554" }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppLayout()(Home);
