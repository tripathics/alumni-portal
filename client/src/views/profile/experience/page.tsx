import cx from "classnames";
import SchemaForm, { Button } from "@/components/forms";
import Modal from "@/components/Modal/Modal";
import { EditPencil, PlusCircle as AddIcon } from "iconoir-react";
import styles from "@/components/layouts/dashboard/Dashboard.module.scss";
import { useEffect, useState } from "react";
import { dataValueLookup } from "@/utils/constants/data";
import experienceFormSchema from "@/utils/formSchema/experienceFormSchema";
import { FieldValues } from "react-hook-form";
import fetchExperiencesApi from "@/utils/api/fetchExperience";
import { ExperienceType } from "@/types/Profile.type";

interface ExperienceFormProps {
  prefillData?: FieldValues;
  onSubmit: (data: FieldValues) => void;
}
const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onSubmit,
  prefillData = {},
}) => (
  <SchemaForm
    prefillData={prefillData}
    schema={experienceFormSchema}
    onSubmit={onSubmit}
    actions={
      <Button type="submit" className="primary">
        Save changes
      </Button>
    }
  />
);

interface ExperienceRowProps {
  data: FieldValues;
  openEditModal: (data: FieldValues) => void;
}
const ExperienceRow: React.FC<ExperienceRowProps> = ({
  data,
  openEditModal,
}) => {
  return (
    <div className={cx(styles["box-row"])}>
      <div className={cx(styles["logo-container"])}>
        <img
          width="50"
          height="50"
          src="https://img.icons8.com/ios-filled/50/university.png"
          alt="university"
        />
      </div>
      <div className={cx(styles["col"])}>
        <div className={cx(styles["college-name"], styles.value)}>
          {data.organisation}
        </div>
        <div className={cx(styles["course-details"], styles.label)}>
          <p className={cx(styles["course-name"])}>
            {data.designation}{" "}
            {data.type === "internship" && dataValueLookup[data.type]}
          </p>
          <p className={cx(styles["course-name"])}>{data.location}</p>
          <p className={cx(styles["course-duration"])}>
            {new Date(data.startDate).toLocaleString("default", {
              month: "short",
            })}{" "}
            {new Date(data.startDate).getFullYear()} -{" "}
            {data.endDate
              ? `${new Date(data.endDate).toLocaleString("default", {
                  month: "short",
                })} ${new Date(data.endDate).getFullYear()}`
              : "Present"}
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
          attrs={{ "aria-label": "Edit education details" }}
          className={cx(styles["editIcon"])}
          onClick={() => openEditModal(data)}
        >
          <EditPencil />
        </Button>
      </div>
    </div>
  );
};

const Experience: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPrefillData, setEditPrefillData] = useState<ExperienceType | null>(
    null
  );
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);

  // add, update or delete
  const updateExperience = (data: FieldValues) => {
    fetch("/api/users/experience", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          fetchExperiences();
          return res.json();
        }
        return null;
      })
      .then((resJson) => {
        console.log(resJson);
        setTimeout(() => setIsModalOpen(false), 1000);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchExperiences = async () => {
    try {
      const response = await fetchExperiencesApi();
      if (response?.success) {
        setExperiences(response.experienceList ? response.experienceList : []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (data: FieldValues | null = null) => {
    setEditPrefillData(data as ExperienceType | null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  return (
    <>
      <section className={styles.box}>
        <div className={styles["box-table"]}>
          <div className={cx(styles["box-row"], styles.header)}>
            <div className={styles["col"]}>
              <h3 className={styles["title"]}>Experience</h3>
            </div>
            <div className={styles.actions}>
              <Button onClick={() => openModal()}>
                <AddIcon />
                Add
              </Button>
            </div>
          </div>
          {experiences.map((e) => (
            <ExperienceRow data={e} key={e.id} openEditModal={openModal} />
          ))}
          <Modal
            modalTitle={editPrefillData ? "Edit Experience" : "Add Experience"}
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
          >
            <section className={styles.box}>
              <ExperienceForm
                onSubmit={updateExperience}
                prefillData={editPrefillData as FieldValues}
              />
            </section>
          </Modal>
        </div>
      </section>
    </>
  );
};

export default Experience;
