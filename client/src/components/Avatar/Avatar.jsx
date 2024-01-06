import styles from './Avatar.module.scss';
import cx from 'classnames';

// https://via.placeholder.com/200

const Avatar = ({ avatar, className = '', size = '200px' }) => (
  <div style={className.length ? {} : { width: size, height: size }} className={cx(styles['avatar'], className)}>
    {avatar
      ? avatar.includes('blob:')
        ? <img src={avatar} alt="avatar" />
        : <img src={`/media/avatars/${avatar}`} alt="avatar" />
      : <img src='https://via.placeholder.com/200' alt="avatar" />
    }
  </div>
)

export default Avatar;