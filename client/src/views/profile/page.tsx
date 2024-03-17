import SchemaForm, { Button } from "@/components/forms";
import cx from "classnames";
import { EditPencil, InfoCircle as InfoIcon } from "iconoir-react";
import { dataValueLookup } from "@/utils/constants/data";
import Modal from "@/components/Modal/Modal";
import { useCallback, useEffect, useState } from "react";
import readProfile from "@/utils/api/readProfile";
import updateProfileApi from "@/utils/api/updateProfile";
import updateAvatarApi from "@/utils/api/updateAvatar";
import useUser from "@/hooks/user";
import Avatar from "@/components/Avatar/Avatar";
import styles from "@/components/layouts/dashboard/Dashboard.module.scss";
import ProfilePictureUpload from "@/components/forms/AvatarUpload";
import personalDetailsFormSchema from "@/utils/formSchema/personalDetailsFormSchema";
import { FieldValues } from "react-hook-form";
import { PersonalDetailsType } from "@/types/Profile.type";
import { toast } from "react-toastify";

interface PersonalDetailsFormProps {
  prefillData: FieldValues;
  onSubmit: (data: FieldValues) => void;
}
const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  prefillData,
  onSubmit,
}) => {
  return (
    <SchemaForm
      prefillData={prefillData}
      schema={personalDetailsFormSchema}
      onSubmit={onSubmit}
      actions={
        <Button type="submit" className="primary">
          Save changes
        </Button>
      }
    />
  );
};

const PersonalDetails = () => {
  const { user, fetchUser } = useUser();

  const [isProfileFormModalOpen, setIsProfileFormModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetailsType>();

  const updateProfile = async (data: FieldValues) => {
    try {
      const response = await updateProfileApi(data as PersonalDetailsType);
      if (response?.success) {
        fetchProfile();
        setTimeout(() => {
          setIsProfileFormModalOpen(false);
          toast.success("Profile updated successfully");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateAvatar = async (file: File) => {
    try {
      const data = await updateAvatarApi(file); // Await the updateAvatarApi function call
      if (data?.success) {
        fetchProfile();
        setTimeout(() => {
          setIsProfileModalOpen(false);
          toast.success("Profile picture updated successfully");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      const data = await readProfile();
      if (data?.success) {
        setPersonalDetails((prev) => ({ ...prev, ...data.user }));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    return () => {
      fetchUser();
    };
  }, [fetchProfile, fetchUser]);

  return personalDetails?.registration_no ? (
    <>
      <section className={cx(styles.box, styles["basic-info-wrapper"])}>
        <div className={styles["actions"]}>
          {user?.profile_locked ? (
            <Button disabled>
              <EditPencil />
              Edit
            </Button>
          ) : (
            <>
              <Button onClick={() => setIsProfileFormModalOpen(true)}>
                <EditPencil />
                Edit
              </Button>
              <Modal
                isOpen={isProfileFormModalOpen}
                modalTitle="Edit personal details"
                setIsOpen={(val) => {
                  setIsProfileFormModalOpen(val);
                }}
              >
                <section className={styles.box}>
                  <PersonalDetailsForm
                    prefillData={
                      { ...personalDetails, email: user?.email } as FieldValues
                    }
                    onSubmit={updateProfile}
                  />
                </section>
              </Modal>
            </>
          )}
        </div>
        <div className={styles["basic-info"]}>
          <div className={styles["avatar-container"]}>
            <Avatar
              avatar={personalDetails.avatar}
              className={styles["avatar-crop"]}
            />
            <Button
              className={styles["avatar-edit"]}
              onClick={() => {
                setIsProfileModalOpen(true);
              }}
            >
              <EditPencil />
            </Button>
            <Modal
              isOpen={isProfileModalOpen}
              setIsOpen={(val) => {
                setIsProfileModalOpen(val);
              }}
              modalTitle="Change profile picture"
            >
              <ProfilePictureUpload
                avatar={personalDetails.avatar}
                updateAvatar={updateAvatar}
              />
            </Modal>
          </div>
          <div className={styles["basic-info-content"]}>
            <h2 className={styles["title"]}>
              {dataValueLookup[personalDetails.title]}{" "}
              {personalDetails.first_name} {personalDetails.last_name}
            </h2>
            <div className={styles["subtitle"]}>
              <p>Class of 2020</p>
              <p className={styles["mono"]}>
                <span title="Registration no.">
                  {personalDetails.registration_no}
                </span>
                |<span title="Roll no.">{personalDetails.roll_no}</span>
              </p>
              <p>
                <span title="Email">{user?.email}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.box}>
        <h3 className={styles["title"]}>Personal details</h3>
        <div className={styles["box-subtitle"]}>
          <p>These details are used for account safety purposes.</p>
        </div>
        <div className={styles["box-table"]}>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Date of Birth</p>
            <p className={cx(styles.col, styles["value"])}>
              {personalDetails.dob}
            </p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Sex</p>
            <p className={cx(styles.col, styles["value"])}>
              {dataValueLookup[personalDetails.sex]}
            </p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Category</p>
            <p className={cx(styles.col, styles["value"])}>
              {dataValueLookup[personalDetails.category]}
            </p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Nationality</p>
            <p className={cx(styles.col, styles["value"])}>
              {personalDetails.nationality}
            </p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Religion</p>
            <p className={cx(styles.col, styles["value"])}>
              {personalDetails.religion}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.box}>
        <h3 className={styles.title}>Contact details</h3>
        <div className={styles["box-table"]}>
          <div className={cx(styles["box-row"], styles.header)}>
            <div className={styles["col"]}>
              <h4 className={styles["box-col-header"]}>Address</h4>
            </div>
            <div className={styles["col"]}>
              <h4 className={styles["box-col-header"]}>Email & Phone</h4>
            </div>
          </div>
          <div className={styles["box-row"]}>
            <div className={styles["col"]}>
              <p className={styles["value"]}>{personalDetails.address}</p>
              <p className={styles["value"]}>
                {personalDetails.city}, {personalDetails.state}
              </p>
              <p
                className={styles["value"]}
              >{`${personalDetails.country} (${personalDetails.pincode})`}</p>
            </div>
            <div className={styles["col"]}>
              <p className={styles["value"]}>{user?.email}</p>
              <p className={styles["value"]}>{personalDetails.alt_email}</p>
              <p className={styles["value"]}>{personalDetails.phone}</p>
              <p className={styles["value"]}>{personalDetails.alt_phone}</p>
            </div>
          </div>
        </div>

        <div className={styles["box-table"]}>
          <div className={cx(styles["box-row"], styles.header)}>
            <h4 className={cx(styles["col"], styles["box-col-header"])}>
              Your Social Profiles
            </h4>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>LinkedIn</p>
            <p className={cx(styles.col, styles["value"])}>
              {personalDetails.linkedin ? (
                <a href={personalDetails.linkedin} target="_blank">
                  {personalDetails.linkedin}
                </a>
              ) : (
                "N/A"
              )}
            </p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>GitHub</p>
            <p className={cx(styles.col, styles["value"])}>
              {personalDetails.github ? (
                <a href={personalDetails.github} target="_blank">
                  {personalDetails.github}
                </a>
              ) : (
                "N/A"
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  ) : (
    <>
      <section className={cx(styles.box, styles.alert, styles.info)}>
        <InfoIcon />
        <h3>
          Fill in your personal details to complete creating your alumni profile
        </h3>
      </section>
      <section className={styles.box}>
        <PersonalDetailsForm
          prefillData={
            { ...personalDetails, email: user?.email } as FieldValues
          }
          onSubmit={updateProfile}
        />
      </section>
    </>
  );
};

export default PersonalDetails;
