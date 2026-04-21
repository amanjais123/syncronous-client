import { Box } from "@mui/material";
import React from "react";

const LayoutLoader = () => {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#faf8ff" }}>
      {/* Sidebar Skeleton */}
      <div style={{ width: 300, background: "#f2f3ff", padding: "1.25rem", flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {/* Header */}
        <div style={{ height: 24, background: "#eaedff", borderRadius: 12, width: "40%", marginBottom: "0.5rem" }} />
        {/* Search bar */}
        <div style={{ height: 40, background: "#eaedff", borderRadius: 9999, marginBottom: "0.5rem" }} />
        {/* Chat items */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.5rem 0" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#eaedff", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 13, background: "#eaedff", borderRadius: 8, marginBottom: 6, width: `${50 + Math.random() * 30}%` }} />
              <div style={{ height: 11, background: "#e2e7ff", borderRadius: 8, width: `${60 + Math.random() * 30}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Chat Panel Skeleton */}
      <div style={{ flex: 1, background: "#ffffff", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ height: 64, background: "#faf8ff", borderBottom: "1px solid rgba(199,196,215,0.3)", display: "flex", alignItems: "center", padding: "0 1.25rem", gap: "0.75rem" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#eaedff" }} />
          <div>
            <div style={{ height: 13, background: "#eaedff", borderRadius: 8, width: 120, marginBottom: 4 }} />
            <div style={{ height: 10, background: "#e2e7ff", borderRadius: 8, width: 60 }} />
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ display: "flex", justifyContent: i % 3 === 0 ? "flex-end" : "flex-start" }}>
              <div style={{
                height: 44,
                width: `${25 + Math.random() * 40}%`,
                background: i % 3 === 0 ? "linear-gradient(90deg, #dae2fd 25%, #e2e7ff 50%, #dae2fd 75%)" : "linear-gradient(90deg, #eaedff 25%, #f2f3ff 50%, #eaedff 75%)",
                backgroundSize: "200% 100%",
                borderRadius: i % 3 === 0 ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                animation: "skeleton-shimmer 1.5s infinite",
              }} />
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div style={{ height: 72, background: "#faf8ff", borderTop: "1px solid rgba(199,196,215,0.3)", display: "flex", alignItems: "center", padding: "0 1.25rem", gap: "0.75rem" }}>
          <div style={{ flex: 1, height: 44, background: "#eaedff", borderRadius: 9999 }} />
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#dae2fd" }} />
        </div>
      </div>
    </div>
  );
};

const TypingLoader = () => {
  return (
    <div className="message-wrap received">
      <div className="typing-indicator">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
};

export { TypingLoader, LayoutLoader };