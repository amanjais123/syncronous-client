import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import { lightBlue } from "../../constants/color";
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
      initial={{ opacity: 0, x: sameSender ? "50%" : "-50%" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 80 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? "#dcf8c6" : "#ffffff",
        color: "#111",
        borderRadius: "1rem",
        padding: "0.75rem 1rem",
        margin: "0.25rem 0",
        maxWidth: "80%",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      {!sameSender && (
        <Typography
          color={lightBlue}
          fontWeight={600}
          fontSize="0.75rem"
          mb="0.25rem"
        >
          {sender.name}
        </Typography>
      )}

      {content && (
        <Typography
          fontSize="0.95rem"
          fontWeight={400}
          sx={{ wordBreak: "break-word" }}
        >
          {content}
        </Typography>
      )}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={index} mt={1}>
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: "black",
                  textDecoration: "none",
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}

      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        textAlign="right"
        mt={0.5}
      >
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
