import { createContext, useContext, useState } from "react";

// 1. Create Context
const UserContext = createContext();

// 2. Create Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 3. Custom Hook to use context
export const useUser = () => useContext(UserContext);
