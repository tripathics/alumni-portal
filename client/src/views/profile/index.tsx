import Header from "@/components/layouts/PageHeader/PageHeader";
import useUser from "@/hooks/user";
import DashboardLayout from "@/components/layouts/dashboard";
import { Outlet } from "react-router";

import PersonalProfile from "./page";
import Education from "./education/page";
import Experience from "./experience/page";

import {
  User as UserIcon,
  Suitcase as SuitcaseIcon,
  Book as BookIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  Lock,
} from "iconoir-react";

const Profile = () => {
  const { user, logout } = useUser();

  const navigations = [
    {
      title: "Profile",
      links: [
        { name: "Personal Profile", path: "", Icon: UserIcon },
        {
          name: "Education",
          path: "education",
          Icon: BookIcon,
        },
        {
          name: "Experience",
          path: "experience",
          Icon: SuitcaseIcon,
        },
      ],
    },
    {
      title: "Account",
      links: [
        {
          name: "Account settings",
          path: "account",
          Icon: SettingsIcon,
        },
        { name: "Logout", path: "/", Icon: LogOutIcon, action: logout },
      ],
    },
  ];

  return (
    <>
      <Header pageHeading={"Profile"} bgImage="/header-bg/2023-04-09.jpg">
        {user?.profileLocked ? (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Lock />
            <p>
              Profile is locked for editing until your membership application is
              resolved.
            </p>
          </div>
        ) : (
          <p>Manage and update your profile</p>
        )}
      </Header>
      <div className="__page-content container">
        <DashboardLayout navigations={navigations}>
          <Outlet />
        </DashboardLayout>
      </div>
    </>
  );
};

export default Profile;
// export { PersonalProfile, Education, Experience };
export { PersonalProfile, Education, Experience };
