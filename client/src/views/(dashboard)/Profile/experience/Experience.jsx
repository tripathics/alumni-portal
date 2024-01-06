import cx from "classnames";
import SchemaForm, { Button } from "@/components/forms";
import ModalComponent from "@/components/Modal";
import { EditPencil, PlusCircle as AddIcon } from "iconoir-react";
import styles from "@/components/layouts/Dashboard/Dashboard.module.scss";
import { useEffect, useState } from "react";
import { dataValueLookup } from "@/utils/data";

const ExperienceForm = ({ onSubmit, prefillData = {} }) => {
  return (
    <SchemaForm
      prefillData={prefillData}
      schema={[
        { type: "section", label: "Professional Details" },
        {
          name: "type",
          label: "Type",
          type: "select",
          required: "Type is required",
          options: [
            { value: "job", label: "Job" },
            { value: "internship", label: "Internship" },
          ],
        },
        {
          name: "organisation",
          label: "Company/Organization",
          type: "text",
          required: "Company/organization name is required",
        },
        {
          name: "designation",
          label: "Designation/Role",
          type: "text",
          required: "Designation is required",
        },
        {
          name: "location",
          label: "Location",
          type: "text",
          required: "Location is required",
        },
        {
          name: "startDate",
          label: "Start date",
          type: "date",
          required: "Start date is required",
        },
        {
          name: "endDate",
          label: "End date (leave empty if this is your current job)",
          type: "date",
        },
        { name: "ctc", label: "CTC in LPA", type: "number" },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      onSubmit={onSubmit}
      actions={
        <Button type="submit" className="primary">
          Save changes
        </Button>
      }
    />
  );
};

const ExperienceComponent = ({ data, openEditModal }) => {
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

const ProfessionalDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPrefillData, setEditPrefillData] = useState({});
  const [experiences, setExperiences] = useState([]);

  // add, update or delete
  const updateExperience = (data) => {
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

  const fetchExperiences = () => {
    fetch("/api/users/experience", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.ok ? res.json() : null;
      })
      .then((resJson) => {
        if (resJson) {
          setExperiences(resJson.experienceList);
        }
      })
      .catch((err) => console.error(err));
  };

  const openModal = (data = null) => {
    setEditPrefillData(data);
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
          {experiences.map((e, i) => (
            <ExperienceComponent data={e} key={i} openEditModal={openModal} />
          ))}
          <ModalComponent
            modalTitle={editPrefillData ? "Edit Experience" : "Add Experience"}
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
          >
            <section className={styles.box}>
              <ExperienceForm
                onSubmit={updateExperience}
                prefillData={editPrefillData}
              />
            </section>
          </ModalComponent>
        </div>
      </section>
    </>
  );
};

export default ProfessionalDetails;
