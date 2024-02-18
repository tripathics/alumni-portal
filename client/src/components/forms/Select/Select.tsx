import styles from "../Form.module.scss";
import { forwardRef } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

export interface SelectProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  name: string;
  label: string;
  options: { label: string; value: string }[];
  required?: boolean | string;
  disabled?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
}
const Select: React.ForwardRefExoticComponent<
  SelectProps & React.RefAttributes<HTMLSelectElement>
> = forwardRef(
  (
    {
      onChange,
      onBlur,
      name,
      label,
      options,
      required = false,
      disabled = false,
      error,
    },
    ref
  ) => {
    return !options || !Array.isArray(options) ? (
      <p>Invalid options array</p>
    ) : (
      <div className={styles["field-wrapper"]}>
        <div className={styles["form-field"]}>
          <label htmlFor={name}>{`Select ${label.toLowerCase()}${
            required ? "" : " (optional)"
          }`}</label>
          <select
            disabled={disabled}
            name={name}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            defaultValue=""
          >
            <option value="" disabled>
              {label}..
            </option>
            {options.map(({ label, value }, index) => (
              <option key={index} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {error &&
          (!Array.isArray(error) ? (
            <p className={styles.error}>{error.message as string}</p>
          ) : (
            error.map((err, index) => (
              <p key={index} className={styles.error}>
                {err.message}
              </p>
            ))
          ))}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
