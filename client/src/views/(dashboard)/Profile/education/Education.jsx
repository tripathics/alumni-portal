import cx from "classnames";
import SchemaForm, { Button } from "@/components/forms";
import ModalComponent from "@/components/Modal";
import { EditPencil, PlusCircle as AddIcon } from "iconoir-react";
import styles from "@/components/layouts/Dashboard/Dashboard.module.scss";
import { useEffect, useState } from "react";
import { dataValueLookup } from "@/utils/data";

const EducationFormNITAP = ({
  onSubmit,
  prefillData = {
    institute: "National Institute of Technology, Arunachal Pradesh",
  },
}) => {
  return (
    <SchemaForm
      prefillData={prefillData}
      schema={[
        {
          name: "institute",
          label: "Institute",
          type: "text",
          required: "Institute is requried",
          disabled: true,
        },
        {
          name: "degree",
          label: "Degree",
          type: "select",
          required: "Degree is required",
          options: [
            { value: "btech", label: "B.Tech" },
            { value: "mtech", label: "M.Tech" },
            { value: "phd", label: "PhD" },
          ],
        },
        {
          name: "type",
          label: "Degree type",
          type: "select",
          options: [
            { value: "full-time", label: "Full time" },
            { value: "part-time", label: "Part time" },
          ],
          required: "Degree type is required",
        },
        {
          name: "discipline",
          label: "Discipline (Field of study)",
          type: "text",
          required: "Discipline is required",
        },
        {
          name: "startDate",
          label: "Start date",
          type: "date",
          required: "Start date is required",
        },
        {
          name: "endDate",
          label: "End date",
          type: "date",
          required: "End date is required",
        },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      onSubmit={onSubmit}
      actions={
        <Button type="submit" className="primary">
          Save
        </Button>
      }
    />
  );
};

const EducationForm = ({ onSubmit, prefillData = {} }) => {
  return (
    <SchemaForm
      prefillData={prefillData}
      schema={[
        {
          name: "institute",
          label: "Institute (Ex. IIT Madras)",
          type: "text",
          required: "Institute is requried",
        },
        {
          name: "degree",
          label: "Degree",
          type: "text",
          required: "Degree is required",
        },
        {
          name: "type",
          label: "Degree type",
          type: "select",
          options: [
            { value: "full-time", label: "Full time" },
            { value: "part-time", label: "Part time" },
          ],
          required: "Degree type is required",
        },
        {
          name: "discipline",
          label: "Discipline (Field of study)",
          type: "text",
          required: "Discipline is required",
        },
        {
          name: "startDate",
          label: "Start date",
          type: "date",
          required: "Start date is required",
        },
        {
          name: "endDate",
          label: "End date (or expected)",
          type: "date",
          required: "End date is required",
        },
        { name: "description", label: "Description", type: "textarea" },
      ]}
      onSubmit={onSubmit}
      actions={
        <Button type="submit" className="primary">
          Save
        </Button>
      }
    />
  );
};

const EducationComponent = ({ data, openEditModal }) => {
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

const AcademicDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPrefillData, setEditPrefillData] = useState({});
  const [educations, setEducations] = useState([]);

  // add, update or delete
  const updateEducation = (data) => {
    fetch("/api/users/education", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          fetchEducation();
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

  const fetchEducation = () => {
    fetch("/api/users/education", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.ok ? res.json() : null;
      })
      .then((resJson) => {
        if (resJson) {
          setEducations(resJson.educationList);
        }
      })
      .catch((err) => console.error(err));
  };

  const openModal = (data = null) => {
    setEditPrefillData(data);
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
          {educations.map((e, i) => (
            <EducationComponent data={e} key={i} openEditModal={openModal} />
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
                  prefillData={editPrefillData}
                />
              </section>
            </ModalComponent>
          )}
        </div>
      </section>
    </>
  );
};

export default AcademicDetails;
