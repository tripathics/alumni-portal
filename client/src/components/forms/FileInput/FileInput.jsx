import { Controller } from "react-hook-form";
import styles from "../Form.module.scss";
import { Upload as UploadIcon } from "iconoir-react";

const FileInput = ({
  control,
  name,
  label = null,
  multiple = false,
  watch,
  required = false,
  allowedFormats = null,
  maxFileSize = null,
  minFileSize = null,
  error = null,
}) => {
  const files = watch(name);
  let fileName = Array.isArray(files)
    ? files.map((file) => file.name).join(", ")
    : null;

  const checkFileType = (values) => {
    if (Array.isArray(allowedFormats)) {
      for (let file of values) {
        if (!allowedFormats.includes(file.type)) {
          return "Inavalid file format";
        }
      }
    }
    return true;
  };

  const checkFileSize = (values) => {
    if (maxFileSize) {
      for (let file of values) {
        if (file.size > maxFileSize * 1000) {
          return `File size should be less than ${maxFileSize / 1000} MB`;
        }
      }
    }
    if (minFileSize) {
      for (let file of values) {
        if (file.size < minFileSize * 1000) {
          return `File size should be greater than ${minFileSize / 1000} MB`;
        }
      }
    }
    return true;
  };

  return (
    <>
      <div className={styles["file-upload-actions"]}>
        <Controller
          control={control}
          rules={{
            required: required,
            validate: {
              checkFileType, // Use the checkFileType function as a validation rule
              checkFileSize,
            },
          }}
          name={name}
          render={({ field }) => (
            <label className={styles.uploadBtn}>
              <UploadIcon />
              {files?.length ? "Change" : "Upload"} {label ? label : "File"}
              <input
                {...field}
                style={{ display: "none" }}
                type="file"
                multiple={multiple}
                value={field.value?.fileName}
                onChange={(e) => {
                  field.onChange(Object.values(e.target.files));
                }}
              />
            </label>
          )}
        />
      </div>
      {fileName && (
        <p className={styles["file-name"]}>Files selected: {fileName}</p>
      )}
      {error && <p className={styles["error"]}>{error.message}</p>}
    </>
  );
};

export default FileInput;
