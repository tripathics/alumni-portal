import styles from './Button.module.scss'
import cx from 'classnames'

const Button = ({ children, type = 'button', className='', attrs = {}, onClick, disabled=false }) => (
  <button type={type} className={cx(styles.btn, className)} disabled={disabled} {...attrs} onClick={onClick}>
    {children}
  </button>
)

export default Button;