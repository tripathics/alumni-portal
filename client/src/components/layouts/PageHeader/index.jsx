import styles from "./PageHeader.module.scss";
import cx from "classnames";

const PageHeader = ({ pageHeading, subHeading, children = null }) => {
  return (
    <header className={styles.header}>
      <div className={cx("container", styles["heading-wrapper"])}>
        <h1 className={styles["page-title"]}>{pageHeading}</h1>
        {subHeading && <p>{subHeading}</p>}
      </div>
      {children && children}
    </header>
  );
};

export default PageHeader;
