import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.scss";
import cx from "classnames";
import { Menu as MenuIcon, User as UserIcon } from "iconoir-react";
import Avatar from "@/components/Avatar/Avatar";
import { dataValueLookup } from "@/utils/data";
import useUser from "@/hooks/useUser";
import { useEffect, useRef, useState } from "react";

const NavLi = ({ label, href, action = null, closeCollapsableNav }) => {
  return (
    <li className={styles["nav-li"]}>
      <NavLink
        end
        className={(state) =>
          cx(styles["link"], {
            [styles["active"]]: action ? false : state.isActive,
          })
        }
        to={href}
        onClick={() => {
          if (action) action();
          closeCollapsableNav();
        }}
      >
        <span className={styles["link-txt"]}>{label}</span>
      </NavLink>
    </li>
  );
};

const Navbar = () => {
  const { loading, user, logout } = useUser();
  const [isUserNavOpen, setIsUserNavOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  const userLinks = [
    { label: "Login", href: "/login", noAuth: true },
    { label: "Register", href: "/register", noAuth: true },
    { label: "Profile", href: "/profile" },
    { label: "Alumni Membership", href: "/alumni-membership" },
    { label: "Logout", href: "/", action: logout },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={cx(styles["nav-container"], "container")}>
        <div className={styles.logo}>
          <NavLink
            to="/"
            onClick={() => {
              setIsMobileNavOpen(false);
              setIsUserNavOpen(false);
            }}
          >
            <img src="/navbar-banner.svg" alt="NIT AP Alumni" height={40} />
          </NavLink>
        </div>
        <div className={styles["nav-content"]}>
          <ul className={styles["nav-list"]}>
            {links.map((link, index) => (
              <NavLi
                key={index}
                {...link}
                closeCollapsableNav={() => {
                  setIsMobileNavOpen(false);
                  setIsUserNavOpen(false);
                }}
              />
            ))}
          </ul>
          <div className={styles["nav-toggles"]}>
            <button
              id={styles.menuToggle}
              type="button"
              aria-label="Menu"
              className={styles["menu-btn"]}
              onClick={() => {
                setIsMobileNavOpen((val) => !val);
                setIsUserNavOpen(false);
              }}
            >
              <MenuIcon width={22} height={22} strokeWidth={2} />
            </button>
            {loading ? (
              <div
                className={styles["spinner"]}
                aria-label="Loading auth status"
              ></div>
            ) : (
              <button
                id={styles.userToggle}
                type="button"
                aria-label="Profile"
                style={user?.avatar ? { border: "none" } : {}}
                className={styles["profile-btn"]}
                onClick={() => {
                  setIsUserNavOpen((val) => !val);
                  setIsMobileNavOpen(false);
                }}
              >
                {user?.avatar ? (
                  <Avatar size={"100%"} avatar={user?.avatar} />
                ) : (
                  <UserIcon width={22} height={22} strokeWidth={2} />
                )}
              </button>
            )}
          </div>

          <CollapsableNav
            isOpen={isMobileNavOpen}
            setIsOpen={setIsMobileNavOpen}
          >
            <hr />
            <ul className={styles["collapsable-nav-list"]}>
              {links.map((link, index) => (
                <NavLi
                  key={index}
                  {...link}
                  closeCollapsableNav={() => {
                    setIsMobileNavOpen(false);
                    setIsUserNavOpen(false);
                  }}
                />
              ))}
            </ul>
          </CollapsableNav>

          <CollapsableNav isOpen={isUserNavOpen} setIsOpen={setIsUserNavOpen}>
            {user && (
              <div className={styles["user-info"]}>
                {user.avatar && <Avatar avatar={user.avatar} size="6rem" />}
                {user.firstName ? (
                  <div className={styles["user-name"]}>
                    {dataValueLookup[user.title]} {user.firstName}{" "}
                    {user.lastName}
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
                    closeCollapsableNav={() => {
                      setIsMobileNavOpen(false);
                      setIsUserNavOpen(false);
                    }}
                  />
                ))}
            </ul>
          </CollapsableNav>
        </div>
      </div>
    </nav>
  );
};

const CollapsableNav = ({ children, isOpen = false, setIsOpen }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (isOpen) {
      ref.current.style.display = "block";
      setTimeout(() => {
        ref.current.classList.add(styles["show"]);
      }, 0);
    } else {
      ref.current.classList.remove(styles["show"]);
      setTimeout(() => {
        ref.current.style.display = "none";
      }, 300);
    }
  }, [isOpen]);
  return (
    <>
      {isOpen && (
        <div
          aria-hidden={true}
          className={styles["collapsable-nav-overlay"]}
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div ref={ref} className={cx(styles["collapsable-nav"], "container")}>
        {children}
      </div>
    </>
  );
};

export default Navbar;
