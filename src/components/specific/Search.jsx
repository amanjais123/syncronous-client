import { useInputValidation } from "6pp";
import { Dialog, Stack, List } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const SearchIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink: 0 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );
  const dispatch = useDispatch();
  const search = useInputValidation("");
  const [users, setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [search.value]);

  return (
    <Dialog
      open={isSearch}
      onClose={searchCloseHandler}
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
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#131b2e", margin: 0 }}>
            Find People
          </h2>
          <button
            onClick={searchCloseHandler}
            style={{
              background: "#eaedff", border: "none", borderRadius: "50%",
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#464554",
            }}
          >
            <XIcon />
          </button>
        </div>

        {/* Search Input */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.625rem",
          background: "#f2f3ff", borderRadius: "9999px", padding: "0.625rem 1rem",
          border: "1.5px solid transparent",
        }}>
          <SearchIcon />
          <input
            id="search-people-input"
            type="text"
            placeholder="Search by username..."
            value={search.value}
            onChange={search.changeHandler}
            style={{
              flex: 1, border: "none", background: "none", outline: "none",
              fontFamily: "inherit", fontSize: "0.9375rem", color: "#131b2e",
            }}
          />
          {search.value && (
            <button
              onClick={() => search.changeHandler({ target: { value: "" } })}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#767586", display: "flex" }}
            >
              <XIcon />
            </button>
          )}
        </div>

        {/* Results */}
        <div style={{ marginTop: "0.75rem", maxHeight: 320, overflowY: "auto" }}>
          {users.length === 0 && search.value.length > 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#767586", fontSize: "0.9rem" }}>
              No users found for "{search.value}"
            </div>
          )}
          {users.length === 0 && search.value.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#767586", fontSize: "0.875rem" }}>
              Search for people to add as friends
            </div>
          )}
          {users.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default Search;