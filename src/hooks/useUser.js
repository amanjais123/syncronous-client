import { useState, useEffect } from "react";

// Optional: Initialize from localStorage if available
const getInitialUser = () => {
  const savedUser = localStorage.getItem("userData");
  return savedUser ? JSON.parse(savedUser) : null;
};

export const useUser = () => {
  const [user, setUser] = useState(getInitialUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      localStorage.removeItem("userData");
    }
  }, [user]);

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  return { user, updateUser };
};
