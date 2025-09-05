import React, { createContext } from "react";

// أنشئ Context
export const AuthContext = createContext();

// أنشئ Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);

  const value = {
    user,
    login: (userData) => setUser(userData),
    logout: () => setUser(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
