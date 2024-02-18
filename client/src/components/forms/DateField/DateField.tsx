import styles from "../Form.module.scss";
import cx from "classnames";
import { forwardRef } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

export interface DateFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  type?: "date" | "month" | "week" | "time" | "datetime-local";
  required?: boolean | string;
  disabled?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
}
const DateField: React.ForwardRefExoticComponent<
  DateFieldProps & React.RefAttributes<HTMLInputElement>
> = forwardRef(
  (
    {
      onChange,
      onBlur,
      name,
      label,
      type = "date",
      required = false,
      disabled = false,
      error,
    }: DateFieldProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    if (!["date", "month", "week", "time", "datetime-local"].includes(type)) {
      return <p>Invalid date type</p>;
    }

    return (
      <div className={styles["field-wrapper"]}>
        <div className={styles["form-field"]}>
          <label
            htmlFor={name}
            data-name={`${label}${required ? "" : " (optional)"}`}
            className={cx({ [styles.filled]: true })}
          >
            <input
              type={type}
              ref={ref}
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
            />
          </label>
        </div>
        {error && <p className={styles.error}>{error.message as string}</p>}
      </div>
    );
  }
);

DateField.displayName = "DateField";

export default DateField;
