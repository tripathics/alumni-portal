import styles from "../Form.module.scss";
import cx from "classnames";
import { forwardRef } from "react";

const DateField = forwardRef(
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
    },
    ref
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
        {error && <p className={styles.error}>{error.message}</p>}
      </div>
    );
  }
);

DateField.displayName = "DateField";

export default DateField;
