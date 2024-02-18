import styles from "../Form.module.scss";
import cx from "classnames";
import { forwardRef } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

export interface NumberFieldProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  value: string;
  required?: boolean | string;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
}

const NumberField: React.ForwardRefExoticComponent<
  NumberFieldProps & React.RefAttributes<HTMLInputElement>
> = forwardRef(
  (
    {
      onChange,
      onBlur,
      name,
      label,
      value,
      required = false,
      disabled = false,
      min,
      max,
      error,
    },
    ref
  ) => {
    if ((min && typeof min !== "number") || (max && typeof max !== "number")) {
      return <p>Invalid range</p>;
    }

    const range: { min?: number; max?: number } = {};
    if (min) range.min = typeof min === "string" ? parseInt(min) : min;
    if (max) range.max = typeof max === "string" ? parseInt(max) : max;
    return (
      <div className={styles["field-wrapper"]}>
        <div className={styles["form-field"]}>
          <label
            htmlFor={name}
            data-name={`${label}${required ? "" : " (optional)"}`}
            className={cx({ [styles.filled]: value?.length > 0 })}
          >
            <input
              type="number"
              {...range}
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

export default NumberField;
