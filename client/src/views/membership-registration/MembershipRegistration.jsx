import Header from "@/components/layouts/PageHeader";
import useUser from "@/hooks/useUser";
import MembershipLayout from "@/components/layouts/Dashboard";
import SchemaForm, { Button } from "@/components/forms";
import {
  Bell as BellIcon,
  GraduationCap as GraduationCapIcon,
} from "iconoir-react";

const MembershipFormComponent = ({ prefillData, onSubmit }) => {
  return (
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
        <Button type="submit" className="btn btn-primary">
          Complete Registration
        </Button>
      }
    />
  );
};

const completeRegistration = (data) => {
  console.log(data);
};
const MembershipForm = () => {
  const { user } = useUser();

  return (
    <>
      <Header
        pageHeading={
          user?.isProfileIncomplete ? "Register here" : "Already responded"
        }
        subHeading={
          user?.isProfileIncomplete
            ? "Complete your membership registration by filling the below details"
            : "Manage and update your alumni profile."
        }
      />
      <div className="__page-content container">
        <MembershipLayout
          navigations={[
            {
              title: "Alumni",
              links: [
                {
                  name: "Membership registration",
                  Icon: GraduationCapIcon,
                  path: "/membership-registration",
                },
                {
                  name: "Form status",
                  Icon: BellIcon,
                  path: "/membership-registration/status",
                },
              ],
            },
          ]}
        >
          <MembershipFormComponent
            prefillData={user}
            onSubmit={completeRegistration}
          />
        </MembershipLayout>
      </div>
    </>
  );
};

export default MembershipForm;
