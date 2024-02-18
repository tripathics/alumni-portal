import { NavLink } from "react-router-dom";
import styles from "../Dashboard.module.scss";
import cx from "classnames";

interface NavLiProps {
  Icon:
    | React.ForwardRefExoticComponent<
        Omit<React.SVGProps<SVGSVGElement>, "ref"> &
          React.RefAttributes<SVGSVGElement>
      >
    | React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
  path: string;
  action?: () => void;
}
const NavLi: React.FC<NavLiProps> = ({ Icon, name, path, action = null }) => {
  return (
    <li>
      <NavLink
        end
        to={path}
        onClick={() => {
          if (action) action();
        }}
        className={(state) =>
          cx(styles["sidebar-nav-link"], {
            [styles["active"]]: state.isActive,
          })
        }
      >
        {Icon && <Icon />}
        {name}
      </NavLink>
    </li>
  );
};

export default NavLi;
