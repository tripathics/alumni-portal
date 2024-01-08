import SchemaForm, { Button } from "@/components/forms";
import styles from "@/components/layouts/Dashboard/Dashboard.module.scss";
import { alumniPrefillApi } from "@/utils/api";
import { useEffect, useState } from "react";

const MembershipForm = () => {
  const [prefillData, setPrefillData] = useState(null);

  useEffect(() => {
    alumniPrefillApi()
      .then((res) => {
        if (res.data) {
          setPrefillData(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className={styles["box"]}>
      <SchemaForm
        prefillData={prefillData}
        schema={[
          { type: "section", label: "Membership Details" },
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
            name: "membershipType",
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
    </div>
  );
};

export default MembershipForm;
