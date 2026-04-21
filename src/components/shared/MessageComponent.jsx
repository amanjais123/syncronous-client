import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachement";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;

  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`message-wrap ${sameSender ? "sent" : "received"}`}
    >
      {/* Sender name (for group received messages) */}
      {!sameSender && sender?.name && (
        <div className="message-sender-name">{sender.name}</div>
      )}

      <div className={`message-bubble ${sameSender ? "sent" : "received"}`}>
        {/* Attachments */}
        {attachments.length > 0 &&
          attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);
            return (
              <Box key={index} mb={content ? 1 : 0}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{ color: sameSender ? "rgba(255,255,255,0.9)" : "#4648d4", textDecoration: "none" }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })}

        {/* Text content */}
        {content && (
          <span style={{ display: "block", wordBreak: "break-word", lineHeight: 1.5 }}>
            {content}
          </span>
        )}

        {/* Timestamp inline */}
        <span
          style={{
            display: "block",
            fontSize: "0.6875rem",
            marginTop: "4px",
            textAlign: "right",
            opacity: sameSender ? 0.7 : 0.6,
            color: sameSender ? "white" : "#464554",
          }}
        >
          {timeAgo}
        </span>
      </div>
    </motion.div>
  );
};

export default memo(MessageComponent);
