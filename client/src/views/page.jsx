import Header from "@/components/layouts/PageHeader";
import styles from "./Home.module.scss";
import cx from "classnames";

const Home = () => {
  return (
    <>
      <Header bgImage="https://nitap.ac.in/storage/gallery/e0c42cb31ccd84b7c28149fe2643ff52.jpg">
        <div className={cx(styles.header)}>
          <div className={styles["header-content"]}>
            <h1 className={styles.heading}>
              Celebrating the 10th convocation of NIT Arunachal Pradesh
            </h1>
            <p>
              On December 19, we welcomed approximately 200, 2023 graduates to
              the 10th convocation ceremony of the National Institute of
              Technology Arunachal Pradesh
            </p>
          </div>
        </div>
      </Header>
      <div className="__page-content container">
        <h1>Home</h1>
      </div>
    </>
  );
};

export default Home;
