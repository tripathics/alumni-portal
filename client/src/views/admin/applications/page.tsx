import Table from "@/components/Table/table";
import styles from "@/components/layouts/dashboard/Dashboard.module.scss";

const Applications = () => {
  return (
    <div>
      <header>
        <h2>Membership Applications</h2>
      </header>

      <main>
        <div className={styles.box}>
          <Table />
        </div>
      </main>
    </div>
  );
};

export default Applications;
