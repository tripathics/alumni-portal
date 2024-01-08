import styles from "../Form.module.scss";
import cx from "classnames";
import { forwardRef } from "react";

const Textarea = forwardRef(
  (
    {
      onChange,
      onBlur,
      name,
      label,
      value,
      error = null,
      required = false,
      disabled = false,
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
              styles["textarea-label"]
            )}
          >
            <textarea
              ref={ref}
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
            />
          </label>
        </div>
        {error && <p className={styles["error"]}>{error.message}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
