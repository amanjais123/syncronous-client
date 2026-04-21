import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AppLayout from "../components/layout/AppLayout";
import { Skeleton, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useInfiniteScrollTop } from "6pp";
import { useSocket } from "../socket";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useUser } from "../hooks/useUser";
import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { transformImage } from "../lib/features";

// SVG Icons
const BackIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const AttachIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const VideoIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="message-wrap received">
    <div className="typing-indicator">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  </div>
);

// Default Avatar
const DefaultAvatar = ({ name, size = 36 }) => {
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  const hue = name ? name.charCodeAt(0) * 15 : 200;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `hsl(${hue}, 55%, 88%)`, color: `hsl(${hue}, 55%, 35%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
};

const Chat = ({ chatId, user, onlineUsers = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user: currentUser } = useUser();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);
  const inputRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const {
    data: oldMessages,
    setData: setOldMessages,
  } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const chat = chatDetails?.data?.chat;

  useEffect(() => {
    const members = chat?.members;
    if (!members) return;
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId, chat?.members]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [oldMessages.length, messages.length]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members: chat.members, chatId });
      setIamTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members: chat.members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members: chat.members, message });
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitHandler(e);
    }
  };

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setOldMessages((prev) => [...prev, data.message]);
    },
    [chatId, setOldMessages]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: { _id: "admin-notify", name: "Admin" },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setOldMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId, setOldMessages]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);
  useErrors([
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ]);

  const allMessagesMap = new Map();
  [...oldMessages, ...messages].forEach((msg) => {
    allMessagesMap.set(msg._id, msg);
  });
  const allMessages = Array.from(allMessagesMap.values());

  const membersDetail = chat?.membersDetail || [];
  const isGroup = chat?.groupChat;

  let avatarUrl = "";
  let displayName = "";

  if (!isGroup) {
    const otherId = chat?.members?.find((id) => id !== user._id);
    const otherUser = membersDetail.find((m) => m._id === otherId);
    avatarUrl = transformImage(otherUser?.avatar);
    displayName = chat?.name?.split("-")[0]?.trim() || "User";
  } else {
    avatarUrl = transformImage(chat?.avatar);
    displayName = chat?.name || "Group";
  }

  const isOtherOnline = !isGroup && chat?.members?.some(id => id !== user._id && onlineUsers.includes(id));

  return chatDetails.isLoading ? (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
            padding: "0.5rem 1.25rem",
          }}
        >
          <Box sx={{
            height: 48, width: `${Math.random() * 40 + 30}%`,
            background: "linear-gradient(90deg, #eaedff 25%, #e2e7ff 50%, #eaedff 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-shimmer 1.5s infinite",
            borderRadius: 16,
          }} />
        </Box>
      ))}
    </Box>
  ) : (
    <Fragment>
      {/* Chat Panel Header */}
      <div className="chat-panel-header">
        {/* Back button — mobile only */}
        <Box sx={{ display: { xs: "flex", sm: "none" } }}>
          <button className="back-btn" onClick={() => navigate("/")} aria-label="Back">
            <BackIcon />
          </button>
        </Box>

        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <DefaultAvatar name={displayName} size={40} />
          )}
          {isOtherOnline && (
            <span style={{
              position: "absolute", bottom: 1, right: 1,
              width: 10, height: 10, background: "#22c55e",
              borderRadius: "50%", border: "2px solid white",
            }} />
          )}
        </div>

        {/* Name & Status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="chat-panel-name">{displayName}</div>
          {isOtherOnline && <div className="chat-panel-status">Online</div>}
          {isGroup && <div style={{ fontSize: "0.75rem", color: "#767586" }}>Group · {chat?.members?.length} members</div>}
        </div>

        {/* Video call btn */}
        <button
          className="header-icon-btn"
          aria-label="Video call"
          style={{ color: "#4648d4" }}
          onClick={() => {
            if (!isGroup) {
              const otherId = chat?.members?.find(id => id !== user._id);
              if (otherId) navigate(`/video/${chatId}`, { state: { calleeId: otherId } });
            }
          }}
        >
          <VideoIcon />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="messages-area"
        style={{ flex: 1, overflowY: "auto" }}
      >
        {allMessages.map((msg) => (
          <MessageComponent key={msg._id || msg.createdAt} message={msg} user={user} />
        ))}
        {userTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={submitHandler}>
        <div className="chat-input-bar">
          <div className="chat-input-wrap">
            <button
              type="button"
              className="chat-attach-btn"
              onClick={handleFileOpen}
              aria-label="Attach file"
            >
              <AttachIcon />
            </button>
            <input
              ref={inputRef}
              id="chat-message-input"
              className="chat-input-field"
              placeholder="Type a message..."
              value={message}
              onChange={messageOnChange}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          </div>
          <button
            id="chat-send-btn"
            type="submit"
            className="chat-send-btn"
            disabled={!message.trim()}
            aria-label="Send message"
            style={{ opacity: message.trim() ? 1 : 0.6 }}
          >
            <SendIcon />
          </button>
        </div>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);
