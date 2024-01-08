import styles from "../Form.module.scss";
import cx from "classnames";
import { forwardRef } from "react";

const TextField = forwardRef(
  (
    {
      pattern = ".*",
      onChange,
      onBlur,
      name,
      label,
      type = "text",
      value,
      error = null,
      required = false,
      disabled = false,
      Icon = null,
    },
    ref
  ) => {
    if (!["text", "email", "password"].includes(type)) {
      return <p>Invalid text type</p>;
    }

    return (
      <div className={styles["field-wrapper"]}>
        <div className={styles["form-field"]}>
          <label
            htmlFor={name}
            data-name={`${label}${required ? "" : " (optional)"}`}
            className={cx(
              { [styles.filled]: value?.length > 0 },
              { [styles.withIcon]: Icon !== null }
            )}
          >
            {Icon && <Icon className={styles.icon} />}
            <input
              pattern={pattern}
              type={type}
              ref={ref}
              name={name}
              onChange={onChange}
              className={cx({ [styles.withIcon]: Icon !== null })}
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

TextField.displayName = "TextField";

export default TextField;
