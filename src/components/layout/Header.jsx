import React, { Suspense, lazy, useState } from "react";
import { Backdrop, Badge, Box, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

// SVG Icons
const SearchIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);
const PlusIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const GroupIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);
const BellIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobile = () => dispatch(setIsMobile(true));
  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => dispatch(setIsNewGroup(true));
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  const navigateToGroup = () => navigate("/groups");

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, { withCredentials: true });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <header className="app-header">
        {/* Mobile: hamburger */}
        <button
          className="header-icon-btn"
          onClick={handleMobile}
          style={{ display: "none" }}
          id="mobile-menu-btn"
          aria-label="Open menu"
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          <MenuIcon />
        </button>

        {/* Desktop hamburger (hidden, kept for mobile css) */}
        <Box sx={{ display: { xs: "flex", sm: "none" } }}>
          <button className="header-icon-btn" onClick={handleMobile} aria-label="Open menu">
            <MenuIcon />
          </button>
        </Box>

        {/* Logo */}
        <div className="app-header-logo">
          <div className="app-header-logo-mark">
            <svg width="18" height="18" viewBox="0 0 78 32" fill="none">
              <path d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z" fill="white" />
              <path d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z" fill="rgba(255,255,255,0.7)" />
              <path d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z" fill="rgba(255,255,255,0.45)" />
            </svg>
          </div>
          <span className="app-header-title">Syncronous</span>
        </div>

        <div className="app-header-spacer" />

        {/* Action Buttons */}
        <Tooltip title="Search People" arrow>
          <button
            id="header-search-btn"
            className="header-icon-btn"
            onClick={openSearch}
            aria-label="Search people"
          >
            <SearchIcon />
          </button>
        </Tooltip>

        <Tooltip title="New Group" arrow>
          <button
            id="header-new-group-btn"
            className="header-icon-btn"
            onClick={openNewGroup}
            aria-label="Create new group"
          >
            <PlusIcon />
          </button>
        </Tooltip>

        <Tooltip title="Manage Groups" arrow>
          <button
            id="header-groups-btn"
            className="header-icon-btn"
            onClick={navigateToGroup}
            aria-label="Manage groups"
          >
            <GroupIcon />
          </button>
        </Tooltip>

        <Tooltip title="Notifications" arrow>
          <button
            id="header-notifications-btn"
            className="header-icon-btn"
            onClick={openNotification}
            aria-label="Notifications"
            style={{ position: "relative" }}
          >
            <BellIcon />
            {notificationCount > 0 && (
              <span className="header-badge">{notificationCount}</span>
            )}
          </button>
        </Tooltip>

        <Tooltip title="Logout" arrow>
          <button
            id="header-logout-btn"
            className="header-icon-btn"
            onClick={logoutHandler}
            aria-label="Logout"
            style={{ color: "#ba1a1a" }}
          >
            <LogoutIcon />
          </button>
        </Tooltip>
      </header>

      {/* Dialogs */}
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotifcationDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

export default Header;
