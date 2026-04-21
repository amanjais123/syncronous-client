import React, { memo } from "react";
import { transformImage } from "../../lib/features";

const PlusIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const MinusIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  const { name, _id, avatar } = user;
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  const hue = name ? name.charCodeAt(0) * 15 : 200;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.625rem 0",
        ...styling,
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 40, height: 40, borderRadius: "50%", flexShrink: 0, overflow: "hidden",
        background: `hsl(${hue}, 55%, 88%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: `hsl(${hue}, 55%, 35%)`, fontSize: "0.875rem", fontWeight: 700,
      }}>
        {avatar ? (
          <img src={transformImage(avatar)} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : initials}
      </div>

      {/* Name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: "0.9375rem", fontWeight: 500, color: "#131b2e", margin: 0,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {name}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={() => handler(_id)}
        disabled={handlerIsLoading}
        style={{
          width: 32, height: 32, borderRadius: "9999px", border: "none", cursor: "pointer",
          background: isAdded
            ? "#ffdad6"
            : "linear-gradient(135deg, #4648d4, #6063ee)",
          color: isAdded ? "#ba1a1a" : "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "opacity 0.2s, transform 0.15s",
          opacity: handlerIsLoading ? 0.6 : 1,
        }}
        onMouseEnter={e => { if (!handlerIsLoading) e.currentTarget.style.transform = "scale(1.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {isAdded ? <MinusIcon /> : <PlusIcon />}
      </button>
    </div>
  );
};

export default memo(UserItem);