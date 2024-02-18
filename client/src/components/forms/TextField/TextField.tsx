import styles from "../Form.module.scss";
import cx from "classnames";
import { forwardRef } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

export interface TextFieldProps {
  pattern?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  type: "text" | "email" | "password";
  value: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  required?: boolean | string;
  disabled?: boolean;
  Icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> &
      React.RefAttributes<SVGSVGElement>
  >;
}

const TextField: React.ForwardRefExoticComponent<
  TextFieldProps & React.RefAttributes<HTMLInputElement>
> = forwardRef(
  (
    {
      pattern = ".*",
      onChange,
      onBlur,
      name,
      label,
      type = "text",
      value,
      error,
      required = false,
      disabled = false,
      Icon,
    },
    ref
  ) => {
    return (
      <div className={styles["field-wrapper"]}>
        <div className={styles["form-field"]}>
          <label
            htmlFor={name}
            data-name={`${label}${required ? "" : " (optional)"}`}
            className={cx(
              { [styles.filled]: value?.length > 0 },
              { [styles.withIcon]: !!Icon }
            )}
          >
            {Icon && <Icon className={styles.icon} />}
            <input
              pattern={pattern}
              type={type}
              name={name}
              onChange={onChange}
              className={cx({ [styles.withIcon]: !!Icon })}
              onBlur={onBlur}
              disabled={disabled}
              ref={ref}
            />
          </label>
        </div>
        {error?.message && (
          <p className={styles["error"]}>{error.message as string}</p>
        )}
      </div>
    );
  }
);

export default TextField;
