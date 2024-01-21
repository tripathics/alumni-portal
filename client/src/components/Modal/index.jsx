import { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import { Xmark as XmarkIcon } from "iconoir-react";

const ModalComponent = ({
  isOpen = false,
  setIsOpen,
  children,
  modalTitle = "",
}) => {
  const modalRef = useRef();

  useEffect(() => {
    const modal = modalRef.current;

    if (isOpen) {
      setTimeout(() => {
        modal.classList.add(styles.active);
      }, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const closeModal = () => {
    modalRef.current.classList.remove(styles.active);
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    isOpen && (
      <div ref={modalRef} className={styles.darkBG}>
        <div className={styles.darkBGOverlay} onClick={closeModal}></div>
        <div className={styles.centered}>
          <header className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{modalTitle}</h2>
            <button className={styles.closeBtn} onClick={closeModal}>
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
