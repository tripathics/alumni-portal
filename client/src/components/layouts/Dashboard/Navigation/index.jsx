import styles from "../Dashboard.module.scss";
import { useLocation } from "react-router-dom";
import NavLi from "./NavLi";

const Navigation = ({ title, links }) => {
  const location = useLocation();

  return (
    <nav className={styles["sidebar-nav"]}>
      <div className={styles["sidebar-nav-header"]}>
        <h2>{title}</h2>
      </div>
      <ul>
        {links.map((link, index) => (
          <NavLi location={location} key={index} {...link} />
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
