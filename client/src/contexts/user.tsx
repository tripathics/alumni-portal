import { createContext, useEffect } from "react";
import useAuth from "../hooks/auth";
import { UserContextType } from "../types/User.type";

export const UserContext = createContext<UserContextType>({
  user: null,
  admin: false,
  loading: false,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
  fetchUser: async () => {},
});

export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { admin, checkAuth, fetchUser, loading, login, logout, user } =
    useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <UserContext.Provider
      value={{ admin, checkAuth, fetchUser, loading, login, logout, user }}
    >
      {children}
    </UserContext.Provider>
  );
};
