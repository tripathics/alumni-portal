import PageHeader from "@/components/layouts/PageHeader/PageHeader";
import MembershipLayout from "@/components/layouts/dashboard";
import {
  Bell as BellIcon,
  GraduationCap as GraduationCapIcon,
} from "iconoir-react";
import { Outlet } from "react-router";
import MembershipForm from "./page";

const Alumni: React.FC = () => {
  const navigations = [
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
  ];

  return (
    <>
      <PageHeader
        pageHeading="Alumni membership"
        subHeading="Complete your membership registration by filling the details below"
        bgImage="/header-bg/2022-01-03.jpg"
      />
      <div className="__page-content container">
        <MembershipLayout navigations={navigations}>
          <Outlet />
        </MembershipLayout>
      </div>
    </>
  );
};

export default Alumni;
export { MembershipForm };
