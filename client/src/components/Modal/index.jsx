import { useEffect } from "react";
import styles from "./Modal.module.scss";
import { Xmark as XmarkIcon } from "iconoir-react";

const ModalComponent = ({
  isOpen = false,
  setIsOpen,
  children,
  modalTitle = "",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    isOpen && (
      <div className={styles.darkBG}>
        <div
          className={styles.darkBGOverlay}
          onClick={() => setIsOpen(false)}
        ></div>
        <div className={styles.centered}>
          <header className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{modalTitle}</h2>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              <XmarkIcon strokeWidth={2} />
            </button>
          </header>
          <div className={styles.modalContent}>{children}</div>
        </div>
      </div>
    )
  );
};

export default ModalComponent;
