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
        bgImage="https://lh3.googleusercontent.com/p/AF1QipOHLZq3d_radN5tYxI-M-dasI3_c5xdK-GRzItp=s0"
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
