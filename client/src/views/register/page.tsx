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
} from "iconoir-react";
import axiosInstance from "@/config/axios.config";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const OTPForm: React.FC<{
  sendOtp: (formData: FieldValues) => void;
  loading: boolean;
}> = ({ sendOtp, loading }) => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(sendOtp)}
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
      <div className={styles["actions"]}>
        <Button disabled={loading} type="submit" className="btn primary">
          Send OTP
        </Button>
      </div>
    </form>
  );
};

const VerifyForm: React.FC<{
  verifyOtp: (formData: FieldValues) => void;
  email: string;
  loading: boolean;
}> = ({ verifyOtp, email, loading }) => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email,
      otp: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(verifyOtp)}
      className={cx(styles["login-form"], styles["box"])}
    >
      <TextField
        type="text"
        required
        disabled
        label="Personal Email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^(?!.*@nitap\.ac\.in).*$/,
            message: "Invalid email or @nitap.ac.in domain is not allowed",
          },
        })}
        Icon={MailIcon}
        value={email}
        error={errors["email"]}
      />
      <TextField
        type="text"
        required
        label="Enter OTP"
        value={watch("otp")}
        {...register("otp", {
          required: "OTP is required",
          pattern: {
            value: /^\d{6}$/,
            message: "Enter a 6 digit OTP",
          },
        })}
        Icon={KeyIcon}
        error={errors["otp"]}
      />
      <div className={styles["actions"]}>
        <Button disabled={loading} type="submit" className="btn primary">
          Verify
        </Button>
      </div>
    </form>
  );
};

const SignupForm: React.FC<{
  signup: (formData: FieldValues) => void;
  email: string;
  loading: boolean;
}> = ({ signup, email, loading }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { email, password: "", confirmPassword: "" },
  });

  return (
    <form
      onSubmit={handleSubmit(signup)}
      className={cx(styles["login-form"], styles["box"])}
    >
      <TextField
        type="text"
        required
        disabled
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
        {...register("password", {
          required: "Password is required",
        })}
        Icon={KeyIcon}
        value={watch("password")}
        error={errors["password"]}
      />
      <TextField
        type="password"
        required
        label="Confirm Password"
        value={watch("confirmPassword")}
        {...register("confirmPassword", {
          required: "Confirm Password is required",
        })}
        Icon={KeyIcon}
        error={errors["confirmPassword"]}
      />
      <div className={styles["actions"]}>
        <Button disabled={loading} type="submit" className="btn primary">
          Register
        </Button>
      </div>
    </form>
  );
};

const Register = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<"otp" | "verify" | "signup">(
    "otp"
  );
  const navigate = useNavigate();

  const signup = async (signupFormData: FieldValues) => {
    try {
      setError(null);
      setLoading(true);
      const data = await signupApi(signupFormData as SignupFormData);
      if (data?.id) {
        toast.success("Account created successfully. Please login.");
        navigate("/login");
      }
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpFormData: FieldValues) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axiosInstance.post("/api/otp/verify", {
        email: otpFormData.email,
        otp: otpFormData.otp,
      });
      if (response.data.success) {
        setFormState("signup");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setError(err.response?.data.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (otpFormData: FieldValues) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axiosInstance.post("/api/users/register-otp-gen", {
        email: otpFormData.email,
      });
      if (response.data.success) {
        setEmail(otpFormData.email);
        setFormState("verify");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message || error.message);
      }
    } finally {
      setLoading(false);
    }
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
      {formState === "otp" ? (
        <OTPForm loading={loading} sendOtp={sendOtp} />
      ) : formState === "verify" ? (
        <VerifyForm
          loading={loading}
          verifyOtp={verifyOtp}
          email={email as string}
        />
      ) : (
        <SignupForm loading={loading} signup={signup} email={email as string} />
      )}
      <div className={cx(styles["box"], styles["action-links"])}>
        <p>
          Already have an account? <NavLink to="/login">Login</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
