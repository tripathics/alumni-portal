import styles from "./Dashboard.module.scss";
import Navigation from "./Navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navigations: {
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
    }[];
  }[];
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  navigations,
}) => (
  <div className={styles["layout"]}>
    <div className={styles["sidebar"]}>
      <nav className={styles["sidebar-nav"]}>
        {navigations.map((navigation, index) => (
          <Navigation key={index} {...navigation} />
        ))}
      </nav>
    </div>
    <div className={styles["content"]}>{children}</div>
  </div>
);

export default DashboardLayout;
