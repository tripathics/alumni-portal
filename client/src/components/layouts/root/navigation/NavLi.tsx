import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.scss";
import cx from "classnames";

export interface NavLiProps {
  label: string;
  href: string;
  action?: () => void;
  type?: "link" | "button";
}
const NavLi: React.FC<NavLiProps> = ({
  label,
  href,
  action,
  type = "link",
}) => {
  return (
    <li className={styles["nav-li"]}>
      <NavLink
        end
        className={(state) =>
          cx(styles["link"], {
            [styles["active"]]: type === "button" ? false : state.isActive,
          })
        }
        to={href}
        onClick={() => {
          if (action) action();
        }}
      >
        <span className={styles["link-txt"]}>{label}</span>
      </NavLink>
    </li>
  );
};

export default NavLi;
