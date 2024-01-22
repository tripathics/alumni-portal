import SchemaForm, { Button } from "@/components/forms";
import cx from "classnames";
import {
  EditPencil,
  InfoCircle as InfoIcon,
  // Trash as TrashIcon,
  // Upload as UploadIcon,
} from "iconoir-react";
import { dataValueLookup } from "@/utils/data";
import ModalComponent from "@/components/Modal";
import { useEffect, useState } from "react";
import { profileApi } from "@/utils/api";
import useUser from "@/hooks/useUser";
import Avatar from "@/components/Avatar/Avatar";
import styles from "@/components/layouts/Dashboard/Dashboard.module.scss";
import ProfilePictureUpload from "@/components/forms/AvatarUpload";

const PersonalDetailsForm = ({ prefillData, onSubmit }) => {
  return (
    <SchemaForm
      prefillData={prefillData}
      schema={[
        { type: "section", label: "Personal Details" },
        {
          name: "title",
          label: "Title",
          type: "select",
          required: "Title is required",
          options: [
            { value: "mr", label: "Mr" },
            { value: "mrs", label: "Mrs" },
            { value: "ms", label: "Ms" },
            { value: "dr", label: "Dr" },
          ],
        },
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          required: "Please provide first name",
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          required: "Please provide last name",
        },
        {
          name: "registrationNo",
          label: "Registration no.",
          type: "text",
          required: "Please provide registration number",
        },
        {
          name: "rollNo",
          label: "Roll no.",
          type: "text",
          required: "Please provide roll number",
        },
        {
          name: "dob",
          label: "Date of Birth",
          type: "date",
          required: "Please provide date of birth",
        },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          required: "Sex is required",
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "others", label: "Others" },
          ],
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          required: "Category is required",
          options: [
            { value: "gen", label: "General" },
            { value: "obc", label: "OBC" },
            { value: "sc", label: "SC" },
            { value: "st", label: "ST" },
            { value: "ews", label: "EWS" },
          ],
        },
        {
          name: "nationality",
          label: "Nationality",
          type: "text",
          required: "Nationality is required",
        },
        {
          name: "religion",
          label: "Religion",
          type: "text",
          required: "Religion is required",
        },
        { type: "section", label: "Contact Details" },
        {
          name: "address",
          label: "Address",
          type: "text",
          required: "Please provide your street address",
        },
        {
          name: "pincode",
          label: "Pincode",
          type: "number",
          required: "Pincode is required",
        },
        {
          name: "state",
          label: "State/Province/Region",
          type: "text",
          required: "State/Province/Region is required",
        },
        {
          name: "city",
          label: "City",
          type: "text",
          required: "City is required",
        },
        {
          name: "country",
          label: "Country",
          type: "text",
          required: "Country is required",
        },
        {
          name: "email",
          label: "Email (update primary email from account settings)",
          type: "email",
          required: "Primary email is required",
          disabled: true,
        },
        { name: "altEmail", label: "Alternate Email", type: "email" },
        {
          name: "phone",
          label: "Phone",
          type: "text",
          required: "Phone number is required",
        },
        { name: "altPhone", label: "Alternate Phone", type: "text" },
        { name: "linkedin", label: "Linkedin", type: "text" },
        { name: "github", label: "Github", type: "text" },
      ]}
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
  const {
    user: { email },
    fetchUser,
  } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    email: email,
  });

  const updateProfile = (data) => {
    console.log("update profile");
    console.log(data);
    fetch("/api/users/update-profile", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          fetchProfile();
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1000);
      });
  };

  const updateAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("/api/users/update-avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle successful upload
        fetchProfile();
      } else {
        // Handle upload error
      }
    } catch (error) {
      // Handle fetch error
    } finally {
      setTimeout(() => {
        setIsProfileModalOpen(false);
      }, 1000);
    }
  };

  const fetchProfile = () => {
    profileApi().then((data) => {
      if (data?.success)
        setPersonalDetails((prev) => ({ ...prev, ...data.personalDetails }));
    });
  };

  useEffect(() => {
    fetchProfile();

    return () => {
      fetchUser();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return personalDetails?.registrationNo ? (
    <>
      <section className={cx(styles.box, styles["basic-info-wrapper"])}>
        <div className={styles["actions"]}>
          <Button onClick={() => setIsModalOpen(true)}>
            <EditPencil />
            Edit
          </Button>
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
            <ModalComponent
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
            </ModalComponent>
          </div>
          <div className={styles["basic-info-content"]}>
            <h2 className={styles["title"]}>
              {dataValueLookup[personalDetails.title]}{" "}
              {personalDetails.firstName} {personalDetails.lastName}
            </h2>
            <div className={styles["subtitle"]}>
              <p>Class of 2020</p>
              <p className={styles["mono"]}>
                <span title="Registration no.">
                  {personalDetails.registrationNo}
                </span>
                |<span title="Roll no.">{personalDetails.rollNo}</span>
              </p>
              <p>
                <span title="Email">{personalDetails.email}</span>
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
              <p className={styles["value"]}>{personalDetails.email}</p>
              <p className={styles["value"]}>{personalDetails.altEmail}</p>
              <p className={styles["value"]}>{personalDetails.phone}</p>
              <p className={styles["value"]}>{personalDetails.altPhone}</p>
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
              {personalDetails.linkedin}
            </p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>GitHub</p>
            <p className={cx(styles.col, styles["value"])}>
              {personalDetails.github}
            </p>
          </div>
        </div>
      </section>
      <ModalComponent
        isOpen={isModalOpen}
        modalTitle="Edit personal details"
        setIsOpen={(val) => {
          setIsModalOpen(val);
        }}
      >
        <section className={styles.box}>
          <PersonalDetailsForm
            prefillData={personalDetails}
            onSubmit={updateProfile}
          />
        </section>
      </ModalComponent>
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
          prefillData={personalDetails}
          onSubmit={updateProfile}
        />
      </section>
    </>
  );
};

export default PersonalDetails;
