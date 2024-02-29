import { Button, TextField } from "@/components/forms";
import { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import styles from "@/components/layouts/auth/Auth.module.scss";
import { FieldValues, useForm } from "react-hook-form";
import cx from "classnames";
import signupApi, { SignupFormData } from "@/utils/api/signup";
import {
  Xmark as XmarkIcon,
  WarningCircle as WarningIcon,
  Mail as MailIcon,
  Key as KeyIcon,
  Number0Square,
} from "iconoir-react";

const EmailOtpForm: React.FC = ({ onSubmit }) => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
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
        <Button disabled={loading} type="submit" className="btn primary">
          Sign up
        </Button>
      </div>
    </form>
  );
};

const Register = () => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const signup = async (signupFormData: FieldValues) => {
    setLoading(true);
    try {
      const data = await signupApi(signupFormData as SignupFormData);
      if (data?.success) {
        return navigate("/login");
      }
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (otpFormData: FieldValues) => {
    setOtpSent(true);
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
        onSubmit={handleSubmit(!otpSent ? sendOtp : signup)}
        className={cx(styles["login-form"], styles["box"])}
      >
        <TextField
          type="text"
          disabled={otpSent}
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
        {!otpSent ? (
          <div className={styles["actions"]}>
            <Button disabled={loading} type="submit" className="btn primary">
              Send OTP
            </Button>
          </div>
        ) : (
          <>
            <p>OTP has been sent to sh****@gmail.com</p>
            <TextField
              type="text"
              required
              label="Enter OTP"
              value={watch("otp")}
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^(0-9)[6]$/,
                  message: "Enter a 6 digit OTP",
                },
              })}
            />
            <div className={styles["actions"]}>
              <Button disabled={loading} type="submit" className="btn primary">
                Verify
              </Button>
            </div>
          </>
        )}
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
