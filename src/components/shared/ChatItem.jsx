import React, { memo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { transformImage } from "../../lib/features";

const DefaultAvatar = ({ name }) => {
  const initials = name
    ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  const hue = name ? name.charCodeAt(0) * 15 : 200;
  return (
    <div style={{
      width: "100%", height: "100%",
      background: `hsl(${hue}, 55%, 88%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: `hsl(${hue}, 55%, 35%)`,
      fontSize: "1rem", fontWeight: 700,
      borderRadius: "50%",
    }}>
      {initials}
    </div>
  );
};

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const avatarUrl = avatar && avatar.length > 0 ? transformImage(avatar[0]) : null;

  return (
    <RouterLink
      to={`/chat/${_id}`}
      style={{ textDecoration: "none", display: "block" }}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: index * 0.04 }}
        className={`chat-item${sameSender ? " active" : ""}`}
      >
        {/* Avatar */}
        <div className="chat-avatar-wrap">
          <div className="chat-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <DefaultAvatar name={name} />
            )}
          </div>
          {isOnline && <span className="chat-online-dot" />}
        </div>

        {/* Info */}
        <div className="chat-info">
          <div className="chat-name">{name}</div>
          {newMessageAlert ? (
            <div className="chat-preview" style={{ color: "#4648d4", fontWeight: 600 }}>
              {newMessageAlert.count} new message{newMessageAlert.count !== 1 ? "s" : ""}
            </div>
          ) : (
            <div className="chat-preview">
              {groupChat ? "Group conversation" : "Tap to chat"}
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="chat-meta">
          {newMessageAlert && (
            <span className="chat-unread-badge">{newMessageAlert.count}</span>
          )}
          {isOnline && !newMessageAlert && (
            <span style={{ fontSize: "0.6875rem", color: "#22c55e", fontWeight: 500 }}>Online</span>
          )}
        </div>
      </motion.div>
    </RouterLink>
  );
};

export default memo(ChatItem);