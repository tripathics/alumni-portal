import styles from "./Button.module.scss";
import cx from "classnames";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  attrs?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  className = "",
  attrs = {},
  onClick,
  disabled = false,
}) => (
  <button
    type={type}
    className={cx(styles.btn, className)}
    disabled={disabled}
    {...attrs}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
