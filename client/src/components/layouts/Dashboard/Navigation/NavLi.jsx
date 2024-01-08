import { NavLink } from "react-router-dom";
import styles from "../Dashboard.module.scss";
import cx from "classnames";

const NavLi = ({ Icon, name, path, action = null, location }) => {
  return (
    <li>
      <NavLink
        to={path}
        onClick={() => {
          if (action) action();
        }}
        className={cx(styles["sidebar-nav-link"], {
          [styles["active"]]: location.pathname === path,
        })}
      >
        {Icon && <Icon />}
        {name}
      </NavLink>
    </li>
  );
};

export default NavLi;
