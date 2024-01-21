import Header from "@/components/layouts/PageHeader";
import useUser from "@/hooks/useUser";
import DashboardLayout from "@/components/layouts/Dashboard";
import { Outlet } from "react-router";

import Annoucements from "./annoucements/page";
import Dashboard from "./dashboard/page";
import SubmissionUpdates from "./submission-updates/page.jsx";

import {
  User as UserIcon,
  SubmitDocument as SubmissionIcon,
  Megaphone as AnnoucementIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
} from "iconoir-react";

const Admin = () => {
  const { logout } = useUser();

  const navigations = [
    {
      title: "Admin Profile",
      links: [
        { name: "Dashboard", path: "/admin", Icon: UserIcon },
        {
          name: "Announcements",
          path: "/admin/announcemnts",
          Icon: AnnoucementIcon,
        },
        {
          name: "Submission updates",
          path: "/admin/submission-updates",
          Icon: SubmissionIcon,
        },
      ],
    },
    {
      title: "Account",
      links: [
        {
          name: "Account settings",
          path: "/admin/account",
          Icon: SettingsIcon,
        },
        { name: "Logout", path: "/", Icon: LogOutIcon, action: logout },
      ],
    },
  ];

  return (
    <>
      <Header pageHeading={"Welcome admin"} />
      <div className="__page-content container">
        <DashboardLayout navigations={navigations}>
          <Outlet />
        </DashboardLayout>
      </div>
    </>
  );
};

export default Admin;
export { Annoucements, Dashboard, SubmissionUpdates };
