import styles from "../Dashboard.module.scss";
import NavLi from "./NavLi";

interface NavigationProps {
  title: string;
  links: {
    name: string;
    path: string;
    Icon:
      | React.ForwardRefExoticComponent<
          Omit<React.SVGProps<SVGSVGElement>, "ref"> &
            React.RefAttributes<SVGSVGElement>
        >
      | React.FC<React.SVGProps<SVGSVGElement>>;
    action?: () => void;
  }[];
}
const Navigation: React.FC<NavigationProps> = ({ title, links }) => (
  <nav className={styles["sidebar-nav"]}>
    <div className={styles["sidebar-nav-header"]}>
      <h2>{title}</h2>
    </div>
    <ul>
      {links.map((link, index) => (
        <NavLi key={index} {...link} />
      ))}
    </ul>
  </nav>
);

export default Navigation;
