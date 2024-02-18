import styles from "./Avatar.module.scss";
import cx from "classnames";

interface AvatarProps {
  avatar: string | null;
  className?: string;
  size?: string;
}
const Avatar: React.FC<AvatarProps> = ({
  avatar,
  className = "",
  size = "200px",
}) => (
  <div
    style={className.length ? {} : { width: size, height: size }}
    className={cx(styles["avatar"], className)}
  >
    {avatar ? (
      avatar.includes("blob:") ? (
        <img src={avatar} alt="avatar" />
      ) : (
        <img src={`/media/avatars/${avatar}`} alt="avatar" />
      )
    ) : (
      <img src="https://via.placeholder.com/200" alt="avatar" />
    )}
  </div>
);

export default Avatar;
