import { useCallback, useState } from "react";
// import { userApi } from "../utils/api";
import { UserType, UserContextType } from "../types/User.type";
import loginApi from "@/utils/api/login";
import logoutApi from "@/utils/api/logout";
import checkAuthApi from "@/utils/api/checkAuth";
import readUser from "@/utils/api/readUser";

const useAuth = (): UserContextType => {
  const [user, setUser] = useState<UserType | null>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await readUser();
      if (!response || !response.success || !response.user) {
        return;
      }
      setUser(response.user);
      setAdmin(response.user.role.includes("admin"));
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (loginFormData: { email: string; password: string }) => {
    try {
      const data = await loginApi(loginFormData);
      if (data?.user) {
        setUser(data.user);
        setAdmin(data.user.role.includes("admin"));
      }
    } catch (error) {
      throw error as string;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      setAdmin(false);
    }
  };

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const data = await checkAuthApi();
      if (!data?.success) {
        setUser(null);
        setAdmin(false);
      } else {
        fetchUser();
      }
    } catch (error) {
      console.error(error);
      setUser(null);
      setAdmin(false);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [fetchUser]);

  return {
    user,
    admin,
    loading,
    login,
    logout,
    checkAuth,
    fetchUser,
  };
};

export default useAuth;
