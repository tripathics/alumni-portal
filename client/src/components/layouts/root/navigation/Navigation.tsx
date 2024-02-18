import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.scss";
import cx from "classnames";
import { Menu as MenuIcon, User as UserIcon } from "iconoir-react";
import Avatar from "@/components/Avatar/Avatar";
import useUser from "@/hooks/user";
import NavLi, { NavLiProps } from "./NavLi";
import Dropdown from "@/components/Dropdown/Dropdown";
import { dataValueLookup } from "@/utils/constants/data";

const Navbar: React.FC = () => {
  const { loading, user, logout } = useUser();

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  interface userLinksType extends NavLiProps {
    noAuth?: boolean;
  }
  const userLinks: userLinksType[] = [
    { label: "Login", href: "/login", noAuth: true },
    { label: "Register", href: "/register", noAuth: true },
    { label: "Profile", href: "/profile" },
    { label: "Alumni Membership", href: "/alumni-membership" },
    { label: "Logout", href: "/", action: logout, type: "button" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={cx(styles["nav-container"], "container")}>
        <div className={styles.logo}>
          <NavLink to="/">
            <img src="/navbar-banner.svg" alt="NIT AP Alumni" height={40} />
          </NavLink>
        </div>
        <div className={styles["nav-content"]}>
          <ul className={styles["nav-list"]}>
            {links.map((link, index) => (
              <NavLi key={index} {...link} />
            ))}
          </ul>
          <div className={styles["nav-toggles"]}>
            <Dropdown
              position="right"
              toggle={() => (
                <button
                  type="button"
                  aria-label="Menu"
                  id={styles.menuToggle}
                  className={styles["menu-btn"]}
                >
                  <MenuIcon width={22} height={22} strokeWidth={2} />
                </button>
              )}
              render={({ setIsOpen }) => (
                <div className={cx(styles["collapsable-nav"], "container")}>
                  <hr />
                  <ul className={styles["collapsable-nav-list"]}>
                    {links.map((link, index) => (
                      <NavLi
                        key={index}
                        {...link}
                        action={() => setIsOpen(false)}
                      />
                    ))}
                  </ul>
                </div>
              )}
            />
            {loading ? (
              <div
                className={styles["spinner"]}
                aria-label="Loading auth status"
              ></div>
            ) : (
              <Dropdown
                position="right"
                toggle={() => (
                  <button
                    id={styles.userToggle}
                    type="button"
                    aria-label="Profile"
                    style={user?.avatar ? { border: "none" } : {}}
                    className={styles["profile-btn"]}
                  >
                    {user?.avatar ? (
                      <Avatar size={"100%"} avatar={user?.avatar} />
                    ) : (
                      <UserIcon width={22} height={22} strokeWidth={2} />
                    )}
                  </button>
                )}
                render={({ setIsOpen }) => (
                  <div className={cx(styles["collapsable-nav"], "container")}>
                    {user && (
                      <div className={styles["user-info"]}>
                        {user.avatar && (
                          <Avatar avatar={user.avatar} size="6rem" />
                        )}
                        {user.firstName ? (
                          <div className={styles["user-name"]}>
                            {
                              dataValueLookup[
                                user.title as keyof typeof dataValueLookup
                              ]
                            }{" "}
                            {user.firstName} {user.lastName}
                          </div>
                        ) : (
                          <div className={styles["message"]}>
                            Please complete your profile
                          </div>
                        )}
                        <div className={styles["user-email"]}>{user.email}</div>
                      </div>
                    )}
                    <hr />
                    <ul className={styles["collapsable-nav-list"]}>
                      {userLinks
                        .filter((l) => !l.noAuth === !!user)
                        .map((link) => (
                          <NavLi
                            key={link.href}
                            {...link}
                            action={() => {
                              setIsOpen(false);
                              link.action && link.action();
                            }}
                          />
                        ))}
                    </ul>
                  </div>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
