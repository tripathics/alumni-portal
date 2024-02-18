import { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import { Xmark as XmarkIcon } from "iconoir-react";

interface ModalProps {
  isOpen?: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  modalTitle?: string;
}
const Modal: React.FC<ModalProps> = ({
  isOpen = false,
  setIsOpen,
  children,
  modalTitle = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modal = modalRef.current;

    if (isOpen && modal) {
      setTimeout(() => {
        modal.classList.add(styles.active);
      }, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const closeModal = () => {
    if (!modalRef.current) return;
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

export default Modal;
