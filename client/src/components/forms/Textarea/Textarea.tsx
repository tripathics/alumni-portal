import styles from "../Form.module.scss";
import cx from "classnames";
import { forwardRef } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

export interface TextareaProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  name: string;
  label: string;
  value: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  required?: boolean | string;
  disabled?: boolean;
}
const Textarea: React.ForwardRefExoticComponent<
  TextareaProps & React.RefAttributes<HTMLTextAreaElement>
> = forwardRef(
  (
    {
      onChange,
      onBlur,
      name,
      label,
      value,
      error,
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
        {error && <p className={styles["error"]}>{error.message as string}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
