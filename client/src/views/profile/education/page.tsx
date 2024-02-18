import cx from "classnames";
import SchemaForm, { Button } from "@/components/forms";
import ModalComponent from "@/components/Modal/Modal";
import { EditPencil, PlusCircle as AddIcon } from "iconoir-react";
import styles from "@/components/layouts/dashboard/Dashboard.module.scss";
import { useEffect, useState } from "react";
import { dataValueLookup } from "@/utils/constants/data";
import {
  educationFormNITAPSchema,
  educationFormSchema,
} from "@/utils/formSchema/educationForm";
import { FieldValues } from "react-hook-form";
import fetchEducationApi from "@/utils/api/fetchEducation";
import updateEducationApi from "@/utils/api/updateEducation";
import { EducationType } from "@/types/Profile.type";

interface EducationFormProps {
  prefillData?: FieldValues;
  onSubmit: (data: FieldValues) => void;
}
const EducationFormNITAP: React.FC<EducationFormProps> = ({
  onSubmit,
  prefillData = {
    institute: "National Institute of Technology, Arunachal Pradesh",
  },
}) => {
  return (
    <SchemaForm
      prefillData={prefillData}
      schema={educationFormNITAPSchema}
      onSubmit={onSubmit}
      actions={
        <Button type="submit" className="primary">
          Save
        </Button>
      }
    />
  );
};

const EducationForm: React.FC<EducationFormProps> = ({
  onSubmit,
  prefillData = {},
}) => {
  return (
    <SchemaForm
      prefillData={prefillData}
      schema={educationFormSchema}
      onSubmit={onSubmit}
      actions={
        <Button type="submit" className="primary">
          Save
        </Button>
      }
    />
  );
};

interface EducationRowProps {
  data: EducationType;
  openEditModal: (data: FieldValues) => void;
}
const EducationRow: React.FC<EducationRowProps> = ({ data, openEditModal }) => {
  return (
    <div className={cx(styles["box-row"])}>
      <div className={cx(styles["logo-container"])}>
        {data.institute ===
        "National Institute of Technology, Arunachal Pradesh" ? (
          <img
            className={styles["logo"]}
            src="/nitap-logo.svg"
            alt="nitap-logo"
          />
        ) : (
          <img
            width="50"
            height="50"
            src="https://img.icons8.com/ios-filled/50/university.png"
            alt="university"
          />
        )}
      </div>
      <div className={cx(styles["col"])}>
        <div className={cx(styles["college-name"], styles.value)}>
          {data.institute}
        </div>
        <div className={cx(styles["course-details"], styles.label)}>
          <p className={cx(styles["course-name"])}>
            {dataValueLookup[data.degree] || data.degree} (
            {dataValueLookup[data.type]}) in {data.discipline}
          </p>
          <p className={cx(styles["course-duration"])}>
            {new Date(data.startDate).toLocaleString("default", {
              month: "short",
            })}{" "}
            {new Date(data.startDate).getFullYear()} -{" "}
            {new Date(data.endDate).toLocaleString("default", {
              month: "short",
            })}{" "}
            {new Date(data.endDate).getFullYear()}
            {new Date(data.endDate) > new Date() ? " (Expected)" : ""}
          </p>
        </div>
        {!!data.description && (
          <div className={cx(styles["course-description"])}>
            {data.description}
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <Button
          attrs={{ "aria-label": "Edit education" }}
          className={cx(styles["editIcon"])}
          onClick={() => openEditModal(data)}
        >
          <EditPencil />
        </Button>
      </div>
    </div>
  );
};

const Education: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPrefillData, setEditPrefillData] = useState<EducationType | null>(
    null
  );
  const [educations, setEducations] = useState<EducationType[] | null>([]);

  // add, update or delete
  const updateEducation = async (data: FieldValues) => {
    try {
      const res = await updateEducationApi(data as EducationType);
      if (res?.success) {
        fetchEducation();
        setTimeout(() => setIsModalOpen(false), 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEducation = async () => {
    try {
      const data = await fetchEducationApi();
      if (data) {
        setEducations(data.educationList || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (data: FieldValues | null = null) => {
    setEditPrefillData(data as EducationType | null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  return (
    <>
      <section className={styles.box}>
        <div className={styles["box-table"]}>
          <div className={cx(styles["box-row"], styles.header)}>
            <div className={styles["col"]}>
              <h3 className={styles["title"]}>Education</h3>
            </div>
            <div className={styles.actions}>
              <Button onClick={() => openModal()}>
                <AddIcon />
                Add
              </Button>
            </div>
          </div>
          {educations?.map((e) => (
            <EducationRow data={e} key={e.id} openEditModal={openModal} />
          ))}

          {educations?.length === 0 ? (
            <ModalComponent
              modalTitle="Add education at NIT Arunachal Pradesh"
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
            >
              <section className={styles.box}>
                <EducationFormNITAP onSubmit={updateEducation} />
              </section>
            </ModalComponent>
          ) : (
            <ModalComponent
              modalTitle={editPrefillData ? "Edit Education" : "Add Education"}
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
            >
              <section className={styles.box}>
                <EducationForm
                  onSubmit={updateEducation}
                  prefillData={editPrefillData as FieldValues}
                />
              </section>
            </ModalComponent>
          )}
        </div>
      </section>
    </>
  );
};

export default Education;
