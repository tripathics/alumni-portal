import Header from "@/components/layouts/PageHeader";
import MembershipLayout from "@/components/layouts/Dashboard";
import {
  Bell as BellIcon,
  GraduationCap as GraduationCapIcon,
} from "iconoir-react";
import MembershipForm from "./membership/MembershipForm";
import { Outlet } from "react-router";

const Alumni = () => {
  return (
    <>
      <Header
        pageHeading="Alumni membership"
        subHeading="Complete your membership registration by filling the details below"
        bgImage="/header-bg/2022-01-03.jpg"
      />
      <div className="__page-content container">
        <MembershipLayout
          navigations={[
            {
              title: "Alumni",
              links: [
                {
                  name: "Life Membership",
                  Icon: GraduationCapIcon,
                  path: "/alumni-membership",
                },
                {
                  name: "Application status",
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
