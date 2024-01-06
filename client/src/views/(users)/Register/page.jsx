import { Button, TextField } from "@/components/forms";
import { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import styles from "../user.module.scss";
import { useForm } from "react-hook-form";
import cx from "classnames";
import { signupApi } from "@/utils/api";
import {
  Xmark as XmarkIcon,
  WarningCircle as WarningIcon,
  Mail as MailIcon,
  Key as KeyIcon,
} from "iconoir-react";

const Register = () => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    setLoading(true);
    signupApi(data)
      .then((resJson) => {
        if (resJson.success) {
          return history("/login");
        }
        setError(resJson.message);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

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
        <h1>Sign up for NIT AP Alumni</h1>
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cx(styles["login-form"], styles["box"])}
      >
        <TextField
          type="text"
          required
          label="Personal Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^(?!.*@nitap\.ac\.in).*$/,
              message: "Invalid email or @nitap.ac.in domain is not allowed",
            },
          })}
          Icon={MailIcon}
          value={watch("email")}
          error={errors["email"]}
        />
        <TextField
          type="password"
          required
          label="Password"
          {...register("password", { required: "Password is required" })}
          value={watch("password")}
          error={errors["password"]}
          Icon={KeyIcon}
        />
        <TextField
          type="password"
          required
          label="Confirm Password"
          {...register("confirmPassword", {
            required: "Password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          Icon={KeyIcon}
          value={watch("confirmPassword")}
          error={errors["confirmPassword"]}
        />
        <div className={styles["actions"]}>
          <Button
            disabled={loading}
            type="submit"
            className="btn primary"
            loading={loading}
          >
            Sign up
          </Button>
        </div>
      </form>
      <div className={cx(styles["box"], styles["action-links"])}>
        <p>
          Already have an account? <NavLink to="/login">Login</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
