import { useEffect, useState, useRef } from "react";
import styles from "./Dropdown.module.scss";
import cx from "classnames";

type RenderProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface DropdownProps {
  toggle: ({ isOpen, setIsOpen }: RenderProps) => React.ReactNode;
  render: ({ isOpen, setIsOpen }: RenderProps) => React.ReactNode;
  position?: "left" | "right" | "center";
}
const Dropdown: React.FC<DropdownProps> = ({
  toggle,
  render,
  position = "left",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={styles.dropdown} ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {toggle({ isOpen, setIsOpen })}
      </div>
      {isOpen && (
        <div className={cx(styles.render, styles[position])}>
          {render({ isOpen, setIsOpen })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
