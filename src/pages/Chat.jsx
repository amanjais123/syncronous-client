import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AppLayout from "../components/layout/AppLayout";
import {
  Avatar,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import chatBg from "../assets/ammu.png";
import { useChatDetailsQuery, useGetMessagesQuery, useMyChatsQuery } from "../redux/api/api";
import { useInfiniteScrollTop } from "6pp";
import { useSocket } from "../socket";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useUser } from "../hooks/useUser";

import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { TypingLoader } from "../components/layout/Loaders";

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
import { InputBox } from "../components/styles/StyledComponents";
import { transformImage } from "../lib/features";
import { grayColor, orange } from "../constants/color";

const Chat = ({ chatId, user, onlineUsers = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user: currentUser } = useUser();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);

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

  const handleStartCall = () => {
    console.log("videocall button")
    if (!chat?.members?.length || chat.groupChat) return;
    const calleeId = chat.members.find((id) => id !== user._id);
    if (!calleeId) return;
    navigate(`/video/${chatId}`, { state: { calleeId } });
  };

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
  }, [oldMessages.length]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, {
        members: chat.members,
        chatId,
      });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, {
        members: chat.members,
        chatId,
      });
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

    socket.emit(NEW_MESSAGE, {
      chatId,
      members: chat.members,
      message,
    });

    setMessage("");
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
        sender: {
          _id: "admin-notify",
          name: "Admin",
        },
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

  let avatar = "";
  let displayName = "";
  let otherUserId = null;

  if (!isGroup) {
    const otherId = chat?.members.find((id) => id !== user._id);
    const otherUser = membersDetail.find((m) => m._id === otherId);
    avatar = transformImage(otherUser?.avatar);
    displayName = chat?.name?.split("-")[0]?.trim() || "User";
    otherUserId = otherId;
  } else {
    avatar = transformImage(chat?.avatar);
    displayName = chat?.name || "Group";
  }

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
     

      {/* Confirm Dialog */}
      <Dialog open={showCallDialog} onClose={() => setShowCallDialog(false)}>
        <DialogTitle>Start a video call with {displayName}?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowCallDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowCallDialog(false);
              handleStartCall();
            }}
            color="primary"
          >
            Start Call
          </Button>
        </DialogActions>
      </Dialog>

      {/* Messages */}
   <Stack
  ref={containerRef}
  padding="1rem"
  spacing="1rem"
  height="95%"
  sx={{
    overflowX: "hidden",
    overflowY: "auto",
    backgroundImage: `url(${chatBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    
  }}
>

        {allMessages.map((msg) => (
          <MessageComponent key={msg._id || msg.createdAt} message={msg} user={user} />
        ))}
        {userTyping && <TypingLoader />}
        <div ref={bottomRef} />
      </Stack>

      {/* Input */}
      <form style={{ height: "12%" }} onSubmit={submitHandler}>
        <Stack direction="row" height="100%" padding="1rem" alignItems="center" position="relative">
          <IconButton
            sx={{ position: "absolute", left: "1.5rem", rotate: "30deg" }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox placeholder="Type Message Here..." value={message} onChange={messageOnChange} />

          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              bgcolor: "#0a6151",
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": { bgcolor: "error.dark" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);
