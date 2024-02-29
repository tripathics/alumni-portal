import styles from "../Form.module.scss"

interface FormSectionHeadingProps {
  label: string;
}
const FormSectionHeading: React.FC<FormSectionHeadingProps> = ({ label }) => (
  <h3 className={styles["section-title"]}>
    {label}
  </h3>
);

export default FormSectionHeading;