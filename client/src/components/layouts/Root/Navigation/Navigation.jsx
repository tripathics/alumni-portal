import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.scss";
import cx from "classnames";
import { Menu as MenuIcon, User as UserIcon } from "iconoir-react";
import Avatar from "@/components/Avatar/Avatar";
import { dataValueLookup } from "@/utils/data";
import { useUser } from "@/contexts/user";

const toggleMobileNav = (e) => {
  e.preventDefault();
  closeUserNav();
  const mobileNav = document.querySelector(`.${styles["mobile-nav"]}`);
  if (mobileNav.classList.contains(styles["show"])) {
    mobileNav.classList.remove(styles["show"]);
    setTimeout(() => {
      mobileNav.style.display = "none";
    }, 300);
  } else {
    mobileNav.style.display = "block";
    setTimeout(() => {
      mobileNav.classList.add(styles["show"]);
    }, 0);
  }
};

const toggleUserNav = (e) => {
  e.preventDefault();
  closeMobileNav();
  const userNav = document.querySelector("#userNav");
  if (userNav.classList.contains(styles["show"])) {
    userNav.classList.remove(styles["show"]);
    setTimeout(() => {
      userNav.style.display = "none";
    }, 300);
  } else {
    userNav.style.display = "block";
    setTimeout(() => {
      userNav.classList.add(styles["show"]);
    }, 0);
  }
};

const closeMobileNav = () => {
  const mobileNav = document.querySelector(`.${styles["mobile-nav"]}`);
  mobileNav.classList.remove(styles["show"]);
  setTimeout(() => {
    mobileNav.style.display = "none";
  }, 300);
};

const closeCollapseNav = () => {
  const collapseNavs = document.querySelectorAll(`.${styles["mobile-nav"]}`);

  collapseNavs.forEach((collapseNav) => {
    collapseNav.classList.remove(styles["show"]);
    setTimeout(() => {
      collapseNav.style.display = "none";
    }, 300);
  });
};

const closeUserNav = () => {
  const userNav = document.querySelector("#userNav");
  userNav.classList.remove(styles["show"]);
  setTimeout(() => {
    userNav.style.display = "none";
  }, 300);
};

const NavLi = ({ label, href, action = null }) => {
  return (
    <li className={styles["nav-li"]}>
      <NavLink
        className={(state) =>
          cx(styles["link"], {
            [styles["active"]]: action ? false : state.isActive,
          })
        }
        to={href}
        onClick={(e) => {
          if (action) action();
          closeCollapseNav(e);
        }}
      >
        <span className={styles["link-txt"]}>{label}</span>
      </NavLink>
    </li>
  );
};

const Navbar = () => {
  const { loading, user, logout } = useUser();

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  const userLinks = [
    { label: "Login", href: "/login", noAuth: true },
    { label: "Register", href: "/register", noAuth: true },
    { label: "Membership registration", href: "/membership-registration" },
    { label: "Profile", href: "/profile" },
    { label: "Logout", href: "/", action: logout },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={cx(styles["nav-container"], "container")}>
        <div className={styles.logo}>
          <NavLink to="/" onClick={closeCollapseNav}>
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
            <button
              id={styles.menuToggle}
              type="button"
              aria-label="Menu"
              className={styles["menu-btn"]}
              onClick={toggleMobileNav}
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
                onClick={toggleUserNav}
              >
                {user?.avatar ? (
                  <Avatar size={"100%"} avatar={user?.avatar} />
                ) : (
                  <UserIcon width={22} height={22} strokeWidth={2} />
                )}
              </button>
            )}
          </div>

          <div className={cx(styles["mobile-nav"], "container")}>
            <hr />
            <ul className={styles["mobile-nav-list"]}>
              {links.map((link, index) => (
                <NavLi key={index} {...link} />
              ))}
            </ul>
          </div>

          <div className={cx(styles["mobile-nav"], "container")} id="userNav">
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
            <ul className={styles["mobile-nav-list"]}>
              {userLinks
                .filter((l) => !l.noAuth === !!user)
                .map((link) => (
                  <NavLi key={link.href} {...link} />
                ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
