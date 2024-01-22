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
        style={
          children
            ? {
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
              }
            : {
                backgroundImage: `url(${bgImage})`,
              }
        }
      />
      <div className={styles["bg-overlay"]} />
      <div className={cx("container", styles["heading-wrapper"])}>
        {pageHeading && <h1 className={styles["page-title"]}>{pageHeading}</h1>}
        {subHeading && <p>{subHeading}</p>}
        {children && children}
      </div>
    </header>
  );
};

export default PageHeader;
