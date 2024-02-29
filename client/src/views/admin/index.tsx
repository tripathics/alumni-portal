import PageHeader from "@/components/layouts/PageHeader/PageHeader";
import DashboardLayout from "@/components/layouts/dashboard";
import { Outlet } from "react-router-dom";
import {
  MultiplePages as MultiplePagesIcon,
  Database as DatabaseIcon,
  Community as CommunityIcon,
  ReportColumns as ReportColumnsIcon,
  UserBadgeCheck as UserBadgeCheckIcon,
  Www as WwwIcon,
} from "iconoir-react";

import Applications from "./applications/page";

const Admin = () => {
  const navigations = [
    {
      title: "",
      links: [
        {
          name: "Dashboard",
          path: "",
          Icon: ReportColumnsIcon,
        },
      ],
    },
    {
      title: "Alumni",
      links: [
        {
          name: "Applications",
          path: "applications",
          Icon: MultiplePagesIcon,
        },
        { name: "Database", path: "alumni", Icon: DatabaseIcon },
      ],
    },
    {
      title: "User",
      links: [
        { name: "Users", path: "users", Icon: CommunityIcon },
        { name: "Roles", path: "roles", Icon: UserBadgeCheckIcon },
      ],
    },
    {
      title: "Content Management",
      links: [
        {
          name: "Website content",
          path: "website-content",
          Icon: WwwIcon,
        },
      ],
    },
  ];

  return (
    <>
      <PageHeader pageHeading="Admin" />
      <div className="__page-content container">
        <DashboardLayout navigations={navigations}>
          <Outlet />
        </DashboardLayout>
      </div>
    </>
  );
};

export default Admin;
export { Applications };
