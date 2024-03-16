import { Button, TextField } from "@/components/forms";
import useUser from "@/hooks/user";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import cx from "classnames";
import {
  Xmark as XmarkIcon,
  WarningCircle as WarningIcon,
  Mail as MailIcon,
  Key as KeyIcon,
} from "iconoir-react";
import styles from "@/components/layouts/auth/Auth.module.scss";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [userType, setUserType] = useState<"user" | "admin">("user"); // ['user', 'admin'
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const { login, user } = useUser();

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);
    try {
      await login(data as { email: string; password: string });
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || !user) return;
    if (!(user.first_name && user.last_name && user.title)) {
      navigate("/profile");
    } else {
      const { from } = location.state || { from: { pathname: "/" } };
      navigate(from);
    }
  }, [user, loading, location, navigate]);

  return (
    <div className={cx("__page-content container", styles["login-container"])}>
      <header className={styles["login-header"]}>
        <NavLink to="/">
          <img
            className={styles["logo"]}
            src="/nitap-logo.svg"
            alt="NIT AP Alumni"
          />
        </NavLink>
        <h1>Sign in to NIT AP Alumni</h1>
      </header>
      {error && (
        <div className={cx(styles["box"], styles["error"])}>
          <WarningIcon />
          <p>{error}</p>
          <button onClick={() => setError(null)}>
            <XmarkIcon />
          </button>
        </div>
      )}

      <div className={styles["tabs"]}>
        <button
          onClick={() => setUserType("user")}
          className={cx(styles.tab, { [styles.active]: userType === "user" })}
        >
          User
        </button>
        <button
          onClick={() => setUserType("admin")}
          className={cx(styles.tab, {
            [styles.active]: userType === "admin",
          })}
        >
          Admin
        </button>
      </div>
      <div className={cx(styles["box"], styles["form-box"])}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cx(styles["login-form"])}
        >
          <TextField
            type="text"
            required
            label="Email"
            Icon={MailIcon}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
            })}
            value={watch("email")}
            error={errors["email"]}
          />
          <TextField
            type="password"
            required
            label="Password"
            Icon={KeyIcon}
            {...register("password", { required: "Password is required" })}
            value={watch("password")}
            error={errors["password"]}
          />
          <div className={styles["actions"]}>
            <Button
              disabled={loading}
              type="submit"
              className="btn primary"
              // loading={loading}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
      <div className={cx(styles["box"], styles["action-links"])}>
        <p>
          Forgot your password?{" "}
          <NavLink to="/reset-password">Reset it here</NavLink>
        </p>
        <p>
          {"Don't have an account?"} <NavLink to="/register">Register</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
