import { useEffect, useState } from "react";
import { checkAuthApi, loginApi, logoutApi, userApi } from "../utils/api";

// a function to set data on local storage
const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = () => {
    userApi()
      .then((data) => {
        if (data?.success) {
          setLocalStorage("user", data.user);
          setUser(data.user);
          setAdmin(data.user.role === "admin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const login = (user) =>
    loginApi(user)
      .then((data) => {
        if (!data.success) {
          throw new Error(data.message);
        }
        if (data.user !== null) {
          setLocalStorage("user", data.user);
          setUser(data.user);
          setAdmin(data.user.admin);
        }
      })
      .catch((err) => {
        if (err.message === "Invalid credentials") {
          throw new Error(err.message);
        } else {
          console.error(err);
        }
      });

  const logout = () =>
    logoutApi()
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setUser(null);
        setAdmin(false);
        localStorage.removeItem("user");
      });

  const checkAuth = () => {
    setLoading(true);
    checkAuthApi()
      .then((data) => {
        if (!data.success) {
          setUser(null);
          setAdmin(false);
        } else {
          // get user data from local storage
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            setUser(user);
            setAdmin(user.role === "admin");
            fetchUser();
          }
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() =>
        setTimeout(() => {
          setLoading(false);
        }, 500)
      );
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, admin, loading, login, logout, checkAuth, fetchUser };
};

export default useAuth;
