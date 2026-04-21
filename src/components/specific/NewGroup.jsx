import { useInputValidation } from "6pp";
import { Dialog, Skeleton } from "@mui/material";
import React, { useState } from "react";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const XIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useErrors([{ isError, error }]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((curr) => curr !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 2) return toast.error("Please select at least 3 members");
    newGroup("Creating New Group...", { name: groupName.value, members: selectedMembers });
    closeHandler();
  };

  const closeHandler = () => dispatch(setIsNewGroup(false));

  return (
    <Dialog
      onClose={closeHandler}
      open={isNewGroup}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          background: "#ffffff",
          width: "100%",
          maxWidth: 440,
          boxShadow: "0 32px 64px rgba(19,27,46,0.12)",
          overflow: "hidden",
        },
      }}
    >
      <div style={{ padding: "1.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#131b2e", margin: 0 }}>
            Create Group
          </h2>
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

        {/* Group Name Input */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#464554", marginBottom: "0.5rem" }}>
            Group Name
          </label>
          <input
            id="new-group-name-input"
            type="text"
            placeholder="e.g. Design Team, Study Buddies..."
            value={groupName.value}
            onChange={groupName.changeHandler}
            style={{
              width: "100%", height: 48,
              background: "#f2f3ff", border: "1.5px solid transparent",
              borderRadius: "9999px", padding: "0 1.25rem",
              fontFamily: "inherit", fontSize: "0.9375rem", color: "#131b2e", outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(70,72,212,0.3)"}
            onBlur={e => e.target.style.borderColor = "transparent"}
          />
        </div>

        {/* Members */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "#464554" }}>
              Add Members
            </label>
            {selectedMembers.length > 0 && (
              <span style={{
                background: "linear-gradient(135deg, #4648d4, #6063ee)",
                color: "white", fontSize: "0.6875rem", fontWeight: 700,
                padding: "2px 8px", borderRadius: "9999px",
              }}>
                {selectedMembers.length} selected
              </span>
            )}
          </div>

          <div style={{ maxHeight: 280, overflowY: "auto" }}>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.625rem 0" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#eaedff" }} />
                  <div style={{ flex: 1, height: 14, background: "#eaedff", borderRadius: 8 }} />
                </div>
              ))
            ) : (
              data?.friends?.map((i) => (
                <UserItem
                  user={i}
                  key={i._id}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(i._id)}
                />
              ))
            )}
            {!isLoading && data?.friends?.length === 0 && (
              <p style={{ color: "#767586", fontSize: "0.875rem", textAlign: "center", padding: "1.5rem 0" }}>
                No friends available. Add some friends first!
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button
            onClick={closeHandler}
            style={{
              flex: 1, height: 44, border: "none", cursor: "pointer",
              background: "#eaedff", color: "#131b2e", fontFamily: "inherit",
              fontSize: "0.9375rem", fontWeight: 600, borderRadius: "9999px",
              transition: "background 0.2s",
            }}
          >
            Cancel
          </button>
          <button
            id="create-group-btn"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
            style={{
              flex: 1, height: 44, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #4648d4, #6063ee)",
              color: "white", fontFamily: "inherit",
              fontSize: "0.9375rem", fontWeight: 600, borderRadius: "9999px",
              opacity: isLoadingNewGroup ? 0.6 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {isLoadingNewGroup ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default NewGroup;