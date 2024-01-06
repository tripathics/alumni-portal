import styles from "./Dashboard.module.scss";
import Navigation from "./Navigation";

const ProfileLayout = ({ children, navigations }) => (
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

export default ProfileLayout;
