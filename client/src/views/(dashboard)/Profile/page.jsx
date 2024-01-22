import Header from "@/components/layouts/PageHeader";
import useUser from "@/hooks/useUser";
import DashboardLayout from "@/components/layouts/Dashboard";
import { Outlet } from "react-router";

import Experience from "./experience/Experience";
import Education from "./education/Education";
import PersonalProfile from "./profile/Profile";

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
        { name: "Personal Details", path: "/profile", Icon: UserIcon },
        {
          name: "Academic Details",
          path: "/profile/education",
          Icon: BookIcon,
        },
        {
          name: "Professional Details",
          path: "/profile/experience",
          Icon: SuitcaseIcon,
        },
      ],
    },
    {
      title: "Account",
      links: [
        {
          name: "Account settings",
          path: "/profile/account",
          Icon: SettingsIcon,
        },
        { name: "Logout", path: "/", Icon: LogOutIcon, action: logout },
      ],
    },
  ];

  return (
    <>
      <Header
        pageHeading={"Profile"}
        // subHeading={
        //   user?.profileLocked
        //     ? "Profile is locked for editing until your membership application is resolved."
        //     : "Manage and update your profile."
        // }
        bgImage="/header-bg/2023-04-09.jpg"
      >
        {user.profileLocked ? (
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
export { PersonalProfile, Education, Experience };
