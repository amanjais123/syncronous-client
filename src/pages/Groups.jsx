import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import { Link } from "../components/styles/StyledComponents";
import { useDispatch, useSelector } from "react-redux";
import UserItem from "../components/shared/UserItem";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";
import Header from "../components/layout/Header";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const BackIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [members, setMembers] = useState([]);

  const errors = [
    { isError: myGroups.isError, error: myGroups.error },
    { isError: groupDetails.isError, error: groupDetails.error },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigateBack = () => navigate("/");
  const handleMobile = () => setIsMobileMenuOpen((prev) => !prev);
  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", { chatId, name: groupNameUpdatedValue });
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    setConfirmDeleteDialog(false);
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <>
      <Header />
      <div style={{ display: "flex", height: "calc(100vh - 64px)", marginTop: 64 }}>
        {/* Groups Sidebar */}
        <Box
          component="aside"
          sx={{
            width: 280,
            flexShrink: 0,
            background: "#f2f3ff",
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} navigateBack={navigateBack} />
        </Box>

        {/* Main Panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#ffffff" }}>
          {/* Mobile menu button */}
          <Box sx={{ display: { xs: "flex", sm: "none" }, padding: "0.75rem 1rem", alignItems: "center", gap: "0.75rem" }}>
            <IconButton onClick={handleMobile} sx={{ color: "#464554" }}>
              <MenuIcon />
            </IconButton>
            <span style={{ fontWeight: 600, color: "#131b2e" }}>Groups</span>
          </Box>

          {groupName ? (
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem" }}>
              {/* Group Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                {isEdit ? (
                  <>
                    <input
                      value={groupNameUpdatedValue}
                      onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
                      style={{
                        flex: 1, height: 48, background: "#f2f3ff", border: "1.5px solid rgba(70,72,212,0.3)",
                        borderRadius: "9999px", padding: "0 1.25rem",
                        fontFamily: "inherit", fontSize: "1rem", fontWeight: 600, color: "#131b2e", outline: "none",
                      }}
                    />
                    <button
                      onClick={updateGroupName}
                      disabled={isLoadingGroupName}
                      style={{
                        height: 44, padding: "0 1.25rem", border: "none", cursor: "pointer",
                        background: "linear-gradient(135deg, #4648d4, #6063ee)",
                        color: "white", borderRadius: "9999px", fontFamily: "inherit", fontWeight: 600,
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEdit(false)}
                      style={{
                        height: 44, padding: "0 1rem", border: "none", cursor: "pointer",
                        background: "#eaedff", color: "#131b2e", borderRadius: "9999px", fontFamily: "inherit",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#131b2e", flex: 1 }}>{groupName}</h2>
                    <IconButton
                      onClick={() => setIsEdit(true)}
                      disabled={isLoadingGroupName}
                      sx={{
                        color: "#4648d4",
                        background: "rgba(70,72,212,0.08)",
                        "&:hover": { background: "rgba(70,72,212,0.15)" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </div>

              {/* Members Section */}
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#464554", marginBottom: "1rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Members · {members.length}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "50vh", overflowY: "auto" }}>
                  {isLoadingRemoveMember ? (
                    <CircularProgress size={24} sx={{ margin: "auto", color: "#4648d4" }} />
                  ) : (
                    members.map((i) => (
                      <div
                        key={i._id}
                        style={{
                          background: "#f2f3ff",
                          borderRadius: 16,
                          overflow: "hidden",
                        }}
                      >
                        <UserItem
                          user={i}
                          isAdded
                          styling={{ padding: "0.875rem 1rem", borderRadius: 16 }}
                          handler={removeMemberHandler}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => dispatch(setIsAddMember(true))}
                  style={{
                    height: 44, padding: "0 1.25rem", border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, #4648d4, #6063ee)",
                    color: "white", fontFamily: "inherit", fontSize: "0.9375rem",
                    fontWeight: 600, borderRadius: "9999px",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                  }}
                >
                  <AddIcon fontSize="small" /> Add Member
                </button>
                <button
                  onClick={() => setConfirmDeleteDialog(true)}
                  style={{
                    height: 44, padding: "0 1.25rem", border: "none", cursor: "pointer",
                    background: "#ffdad6", color: "#ba1a1a", fontFamily: "inherit",
                    fontSize: "0.9375rem", fontWeight: 600, borderRadius: "9999px",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                  }}
                >
                  <DeleteIcon fontSize="small" /> Delete Group
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "1rem", padding: "2rem", textAlign: "center",
            }}>
              <div style={{ fontSize: "3rem" }}>👥</div>
              <h3 style={{ fontWeight: 700, color: "#131b2e", fontSize: "1.25rem" }}>Select a Group</h3>
              <p style={{ color: "#767586", fontSize: "0.9rem", maxWidth: 280 }}>
                Choose a group from the sidebar to view and manage its details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Dialog */}
      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {/* Confirm Delete */}
      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={() => setConfirmDeleteDialog(false)}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      {/* Mobile Drawer */}
      <Drawer
        sx={{ display: { xs: "block", sm: "none" } }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
        PaperProps={{
          sx: {
            width: "75vw",
            background: "#f2f3ff",
            borderTopRightRadius: "24px",
            borderBottomRightRadius: "24px",
          },
        }}
      >
        <GroupsList
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
          navigateBack={navigateBack}
        />
      </Drawer>
    </>
  );
};

const GroupsList = ({ myGroups = [], chatId, navigateBack }) => (
  <Stack
    sx={{
      height: "100%",
      overflow: "auto",
      padding: "1.25rem 0",
    }}
  >
    <div style={{ padding: "0 1.25rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <button
          onClick={navigateBack}
          style={{
            width: 32, height: 32, borderRadius: "9999px",
            background: "#eaedff", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#131b2e",
          }}
        >
          <BackIcon />
        </button>
        <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "#131b2e" }}>Your Groups</span>
      </div>
    </div>

    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <div style={{ padding: "2rem 1.25rem", textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👥</div>
        <p style={{ color: "#767586", fontSize: "0.875rem" }}>No groups yet</p>
      </div>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  const isActive = chatId === _id;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => { if (isActive) e.preventDefault(); }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1.25rem",
        textDecoration: "none",
        background: isActive ? "#e2e7ff" : "transparent",
        transition: "background 0.15s",
      }}
    >
      <AvatarCard avatar={avatar} />
      <Typography
        sx={{
          fontSize: "0.9375rem",
          fontWeight: isActive ? 600 : 400,
          color: "#131b2e",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {name}
      </Typography>
    </Link>
  );
});

export default Groups;