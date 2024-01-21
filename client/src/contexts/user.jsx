import { createContext } from "react";
import useAuth from "../hooks/auth";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const { checkAuth, loading, login, user, fetchUser, admin, logout } =
    useAuth();

  return (
    <UserContext.Provider
      value={{ loading, user, admin, login, fetchUser, logout, checkAuth }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
