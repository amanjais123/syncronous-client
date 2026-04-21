import { Drawer, Skeleton, Box } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { useSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Header from "./Header";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = useSocket();

    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId, dispatch]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {/* Mobile Drawer — full-width chat list */}
        <Drawer
          open={isMobile}
          onClose={handleMobileClose}
          PaperProps={{
            sx: {
              width: "85vw",
              maxWidth: 360,
              background: "#f2f3ff",
              boxShadow: "0 20px 60px rgba(19,27,46,0.15)",
              borderTopRightRadius: "24px",
              borderBottomRightRadius: "24px",
              padding: 0,
              overflow: "hidden",
            },
          }}
        >
          {/* Drawer Header */}
          <Box sx={{
            padding: "1.25rem 1.25rem 0.75rem",
            background: "#f2f3ff",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.625rem", mb: "0.75rem" }}>
              <Box sx={{
                width: 28, height: 28,
                background: "linear-gradient(135deg, #4648d4, #6063ee)",
                borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <svg width="14" height="14" viewBox="0 0 78 32" fill="none">
                  <path d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z" fill="white" />
                  <path d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z" fill="rgba(255,255,255,0.7)" />
                  <path d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z" fill="rgba(255,255,255,0.45)" />
                </svg>
              </Box>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: "#131b2e" }}>Messages</span>
            </Box>
            {/* Search in drawer */}
            <Box sx={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "#eaedff", borderRadius: "9999px",
              padding: "0.5rem 1rem",
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#767586" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span style={{ fontSize: "0.875rem", color: "#767586" }}>Search...</span>
            </Box>
          </Box>

          {isLoading ? (
            <Skeleton variant="rectangular" height="100%" sx={{ margin: "1rem" }} />
          ) : (
            <ChatList
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          )}
        </Drawer>

        {/* Desktop Layout */}
        <div className="app-layout">
          {/* Sidebar */}
          <Box
            component="aside"
            className="app-sidebar"
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            {/* Sidebar Header */}
            <div className="chat-list-header">
              <div className="chat-list-title">Messages</div>
              <div className="chat-search-bar">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#767586" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input className="chat-search-input" placeholder="Search conversations..." />
              </div>
            </div>

            <div className="chat-list-items">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <Box key={i} sx={{ display: "flex", gap: "0.75rem", padding: "0.75rem 1.25rem", alignItems: "center" }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: "50%", background: "#eaedff" }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ height: 14, background: "#eaedff", borderRadius: 8, mb: "6px", width: "60%" }} />
                      <Box sx={{ height: 11, background: "#eaedff", borderRadius: 8, width: "80%" }} />
                    </Box>
                  </Box>
                ))
              ) : (
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              )}
            </div>
          </Box>

          {/* Chat Panel */}
          <main className="app-chat-panel">
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </main>
        </div>
      </>
    );
  };
};

export default AppLayout;
