import SchemaForm, { Button } from "@/components/forms";
import styles from "@/components/layouts/Dashboard/Dashboard.module.scss";
import { alumniPrefillApi } from "@/utils/api";
import cx from "classnames";
import { InfoCircle as InfoIcon } from "iconoir-react";
import { useEffect, useState } from "react";
import { dataValueLookup } from "@/utils/data";
import { NavLink } from "react-router-dom";

const MembershipForm = () => {
  const [userData, setUserData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alumniPrefillApi()
      .then((res) => {
        if (res.success) {
          setUserData(res.data);
        } else {
          setErrorMsg(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "sign") {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });
    fetch("/api/alumni/membership", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return "error";
      })
      .then((resJson) => {
        console.log(resJson);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return loading ? (
    <p>Please wait</p>
  ) : errorMsg ? (
    <section className={cx(styles.box, styles.alert, styles.info)}>
      <InfoIcon />
      <h3>{errorMsg}</h3>
    </section>
  ) : (
    <>
      <section className={cx(styles["box"], styles["alert"])}>
        <InfoIcon className={styles["icon"]} />
        <p>
          Make sure your details are correct before applying for life
          membership. Go to your <NavLink to="/profile">profile</NavLink> to
          make any corrections.
        </p>
      </section>
      <section className={styles["box"]}>
        <h1 className={styles["title"]}>Profile details</h1>
        <div className={styles["box-table"]}>
          <div className={cx(styles["box-row"], styles.header)}>
            <div className={styles["col"]}>
              <h4 className={styles["box-col-header"]}>Personal details</h4>
            </div>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Full name</p>
            <p className={cx(styles.col, styles["value"])}>
              {dataValueLookup[userData.title]} {userData.firstName}{" "}
              {userData.lastName}
            </p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Date of Birth</p>
            <p className={cx(styles.col, styles["value"])}>{userData.dob}</p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Category</p>
            <p className={cx(styles.col, styles["value"])}>
              {dataValueLookup[userData.category]}
            </p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Nationality</p>
            <p className={cx(styles.col, styles["value"])}>
              {userData.nationality}
            </p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Religion</p>
            <p className={cx(styles.col, styles["value"])}>
              {userData.religion}
            </p>
          </div>
        </div>

        <div className={styles["box-table"]}>
          <div className={cx(styles["box-row"], styles.header)}>
            <div className={styles["col"]}>
              <h4 className={styles["box-col-header"]}>
                Education at NIT Arunachal Pradesh
              </h4>
            </div>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Registration no.</p>
            <p className={cx(styles.col, styles["value"])}>
              {userData.registrationNo}
            </p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Roll no.</p>
            <p className={cx(styles.col, styles["value"])}>{userData.rollNo}</p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Course</p>
            <p className={cx(styles.col, styles["value"])}>
              {dataValueLookup[userData.degree]} in {userData.discipline}
            </p>
          </div>
          <div className={styles["box-row"]}>
            <p className={cx(styles.col, styles["label"])}>Graduation year</p>
            <p className={cx(styles.col, styles["value"])}>
              {userData.endDate.slice(0, 4)}
            </p>
          </div>
        </div>

        <div className={styles["box-table"]}>
          <div className={cx(styles["box-row"], styles.header)}>
            <div className={styles["col"]}>
              <h4 className={styles["box-col-header"]}>Address</h4>
            </div>
            <div className={styles["col"]}>
              <h4 className={styles["box-col-header"]}>Email & Phone</h4>
            </div>
          </div>
          <div className={styles["box-row"]}>
            <div className={styles["col"]}>
              <p className={styles["value"]}>{userData.address}</p>
              <p className={styles["value"]}>
                {userData.city}, {userData.state}
              </p>
              <p
                className={styles["value"]}
              >{`${userData.country} (${userData.pincode})`}</p>
            </div>
            <div className={styles["col"]}>
              <p className={styles["value"]}>{userData.email}</p>
              <p className={styles["value"]}>{userData.altEmail}</p>
              <p className={styles["value"]}>{userData.phone}</p>
              <p className={styles["value"]}>{userData.altPhone}</p>
            </div>
          </div>
        </div>
      </section>
      <section className={styles["box"]}>
        <SchemaForm
          schema={[
            { type: "section", label: "Membership Preferences" },
            {
              name: "membershipLevel",
              label: "Membership level",
              type: "select",
              required: "Membership level is required",
              options: [
                {
                  value: "level1_networking",
                  label:
                    "Yes! I am Interested to get information and networking only",
                },
                {
                  value: "level2_volunteering",
                  label:
                    "Yes! I am Interested in volunteering for events and activities",
                },
              ],
            },
            {
              name: "sign",
              label: "Signature",
              type: "file",
              required: "Signature is required",
              allowedFormats: ["image/jpeg", "image/png", "image/gif"],
              maxFileSize: 1000,
            },
          ]}
          onSubmit={onSubmit}
          actions={
            <Button type="submit" className="btn primary">
              Submit for approval
            </Button>
          }
        />
      </section>
    </>
  );
};

export default MembershipForm;
