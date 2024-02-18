import Avatar from "@/components/Avatar/Avatar";
import styles from "@/components/layouts/dashboard/Dashboard.module.scss";
import formStyles from "@/components/forms/Form.module.scss";
import cx from "classnames";
import { Upload as UploadIcon, Trash as TrashIcon } from "iconoir-react";
import { Button } from "..";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useState } from "react";

interface ProfilePictureUploadProps {
  avatar: string | null;
  updateAvatar: (avatar: File) => void;
}
const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  avatar,
  updateAvatar,
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [fileUrl, setFileUrl] = useState(avatar);

  const onSubmit = async (data: FieldValues) => {
    updateAvatar(data.avatar);
  };

  const checkFileType = (file: File): string | true => {
    if (!file) {
      return true;
    }
    if (
      !["image/webp", "image/png", "image/jpeg", "image/jpg"].includes(
        file.type
      )
    ) {
      return "Inavalid file format";
    }
    return true;
  };

  const checkFileSize = (file: File): string | true => {
    if (!file) {
      return true;
    }
    console.log(file.size);
    const maxFileSize = 5000;
    const minFileSize = 1;
    if (file.size > maxFileSize * 1000) {
      return `File size should be less than ${maxFileSize / 1000} MB`;
    }
    if (file.size < minFileSize * 1000) {
      return `File size should be greater than ${minFileSize / 1000} MB`;
    }
    return true;
  };

  return (
    <div className={cx(styles.box, styles["avatar-upload"])}>
      <Avatar avatar={fileUrl} className={styles["avatar-crop"]} />
      <div className={styles["avatar-upload-info"]}>
        <p>
          For best results, use an image at least 200px by 200px in .jpg format
        </p>
      </div>
      {errors.avatar && (
        <p className={formStyles["error"]}>{errors.avatar.message as string}</p>
      )}
      <form className={styles["avatar-upload-form"]}>
        <div className={styles["avatar-upload-actions"]}>
          <Controller
            control={control}
            rules={{
              validate: {
                checkFileType, // Use the checkFileType function as a validation rule
                checkFileSize,
              },
            }}
            name="avatar"
            render={({ field }) => (
              <>
                <label className={styles.uploadBtn}>
                  <UploadIcon />
                  {fileUrl ? "Change picture" : "Upload picture"}
                  <input
                    {...field}
                    style={{ display: "none" }}
                    type="file"
                    multiple={false}
                    value={field.value?.fileName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files && e.target.files.length > 0) {
                        field.onChange(e.target.files[0]);
                        setFileUrl(URL.createObjectURL(e.target.files[0]));
                      } else {
                        field.onChange(null);
                        setFileUrl(null);
                      }
                    }}
                  />
                </label>
                {fileUrl && (
                  <Button
                    onClick={() => {
                      field.onChange(null);
                      setFileUrl(null);
                    }}
                  >
                    <TrashIcon />
                    Remove picture
                  </Button>
                )}
              </>
            )}
          />
          {avatar !== fileUrl && (
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="primary"
            >
              Save changes
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePictureUpload;
