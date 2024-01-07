import Header from "@/components/layouts/PageHeader";
import { useUser } from "@/contexts/user";
import MembershipLayout from "@/components/layouts/Dashboard";
import {
  Bell as BellIcon,
  GraduationCap as GraduationCapIcon,
} from "iconoir-react";
import MembershipForm from "./membership/MembershipForm";
import { Outlet } from "react-router";

const Alumni = () => {
  const { user } = useUser();

  return (
    <>
      <Header
        pageHeading={
          user?.registrationNo ? "Register here" : "Already responded"
        }
        subHeading={
          user?.registrationNo
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
                  path: "/alumni-membership",
                },
                {
                  name: "Form status",
                  Icon: BellIcon,
                  path: "/alumni-membership/status",
                },
              ],
            },
          ]}
        >
          <Outlet />
        </MembershipLayout>
      </div>
    </>
  );
};

export default Alumni;
export { MembershipForm };
