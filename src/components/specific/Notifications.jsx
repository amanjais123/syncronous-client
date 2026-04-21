import {
  Avatar,
  Button,
  Dialog,
  ListItem,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";

const XIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);

  const hasNotifications = !isLoading && data?.allRequests?.length > 0;

  return (
    <Dialog
      open={isNotification}
      onClose={closeHandler}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          background: "#ffffff",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 32px 64px rgba(19,27,46,0.12)",
          overflow: "hidden",
        },
      }}
    >
      <div style={{ padding: "1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#131b2e", margin: 0 }}>
              Notifications
            </h2>
            {hasNotifications && (
              <p style={{ fontSize: "0.8125rem", color: "#464554", marginTop: "2px" }}>
                {data.allRequests.length} pending request{data.allRequests.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={closeHandler}
            style={{
              background: "#eaedff", border: "none", borderRadius: "50%",
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#464554",
            }}
          >
            <XIcon />
          </button>
        </div>

        {/* Content */}
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.75rem 0" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#eaedff", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 13, background: "#eaedff", borderRadius: 8, marginBottom: "6px" }} />
                  <div style={{ height: 11, background: "#eaedff", borderRadius: 8, width: "70%" }} />
                </div>
              </div>
            ))
          ) : hasNotifications ? (
            data.allRequests.map(({ sender, _id }) => (
              <NotificationItem
                sender={sender}
                _id={_id}
                handler={friendRequestHandler}
                key={_id}
              />
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔔</div>
              <p style={{ color: "#464554", fontSize: "0.9375rem", fontWeight: 500 }}>You're all caught up!</p>
              <p style={{ color: "#767586", fontSize: "0.8125rem", marginTop: "0.25rem" }}>No pending friend requests</p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.875rem",
      padding: "0.75rem 0",
      borderBottom: "1px solid rgba(199,196,215,0.3)",
    }}>
      {/* Avatar */}
      <div style={{
        width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #eaedff, #dae2fd)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1rem", fontWeight: 700, color: "#4648d4",
        overflow: "hidden",
      }}>
        {avatar ? (
          <img src={avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : initials}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#131b2e", margin: 0 }}>{name}</p>
        <p style={{ fontSize: "0.8rem", color: "#464554", margin: 0, marginTop: "2px" }}>
          Sent you a friend request
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button
          onClick={() => handler({ _id, accept: true })}
          style={{
            height: 32, padding: "0 0.75rem", border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #4648d4, #6063ee)",
            color: "white", fontFamily: "inherit", fontSize: "0.8125rem",
            fontWeight: 600, borderRadius: "9999px",
          }}
        >
          Accept
        </button>
        <button
          onClick={() => handler({ _id, accept: false })}
          style={{
            height: 32, padding: "0 0.75rem", border: "none", cursor: "pointer",
            background: "#ffdad6", color: "#ba1a1a", fontFamily: "inherit",
            fontSize: "0.8125rem", fontWeight: 600, borderRadius: "9999px",
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
});

export default Notifications;
