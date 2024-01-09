import SchemaForm, { Button } from "@/components/forms";
import styles from "@/components/layouts/Dashboard/Dashboard.module.scss";
import { alumniPrefillApi } from "@/utils/api";
import cx from "classnames";
import { InfoCircle as InfoIcon } from "iconoir-react";
import { useEffect, useState } from "react";

const MembershipForm = () => {
  const [prefillData, setPrefillData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alumniPrefillApi()
      .then((res) => {
        if (res.success) {
          setPrefillData(res.data);
        } else {
          setErrorMsg(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSubmit = (data) => {
    console.log(data);
  };

  return loading ? (
    <p>Please wait</p>
  ) : errorMsg ? (
    <section className={cx(styles.box, styles.alert, styles.info)}>
      <InfoIcon />
      <h3>{errorMsg}</h3>
    </section>
  ) : (
    <section className={styles["box"]}>
      <SchemaForm
        prefillData={prefillData}
        schema={[
          { type: "section", label: "Membership Details" },
          {
            name: "firstName",
            label: "First Name",
            type: "text",
            required: "Please provide first name",
            disabled: true,
          },
          {
            name: "lastName",
            label: "Last Name",
            type: "text",
            required: "Please provide last name",
            disabled: true,
          },
          {
            name: "registrationNo",
            label: "Registration no.",
            type: "text",
            required: "Please provide registration number",
            disabled: true,
          },
          {
            name: "rollNo",
            label: "Roll no.",
            type: "text",
            required: "Please provide roll number",
            disabled: true,
          },
          {
            name: "dob",
            label: "Date of Birth",
            type: "date",
            required: "Please provide date of birth",
            disabled: true,
          },
          {
            name: "membershipLevel",
            label: "Membership level",
            type: "select",
            required: "Membership level is required",
            options: [
              {
                value: "level1_networking",
                label:
                  "Yes! I am Interested to get information and networking only",
              },
              {
                value: "level2_volunteering",
                label:
                  "Yes! I am Interested in volunteering for events and activities",
              },
            ],
          },
        ]}
        onSubmit={onSubmit}
        actions={
          <Button type="submit" className="btn primary">
            Complete Registration
          </Button>
        }
      />
    </section>
  );
};

export default MembershipForm;
