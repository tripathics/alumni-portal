import styles from "./PageHeader.module.scss";
import cx from "classnames";

const PageHeader = ({
  pageHeading,
  subHeading,
  children = null,
  bgImage = null,
}) => {
  return (
    <header className={styles.header}>
      <div
        className={styles["bg-image"]}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: children ? "cover" : "75%",
        }}
      />
      <div className={styles["bg-overlay"]} />
      <div className={cx("container", styles["heading-wrapper"])}>
        {pageHeading && <h1 className={styles["page-title"]}>{pageHeading}</h1>}
        {subHeading && <p>{subHeading}</p>}
      </div>
      {children && children}
    </header>
  );
};

export default PageHeader;
