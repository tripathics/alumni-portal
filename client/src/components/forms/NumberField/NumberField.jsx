import styles from '../Form.module.scss'
import cx from 'classnames'
import { forwardRef } from 'react'

const NumberField = forwardRef(({ onChange, onBlur, name, label, value, required=false, disabled=false, min = null, max = null, error }, ref) => {
  if ((min && typeof min !== 'number') || (max && typeof max !== 'number')) {
    return <p>Invalid range</p>
  }

  const range = {}
  if (min) range.min = min
  if (max) range.max = max
  return (
    <div className={styles['field-wrapper']}>
    <div className={styles['form-field']}>
      <label htmlFor={name} data-name={`${label}${required ? '' : ' (optional)'}`} className={cx(
        { [styles.filled]: value?.length > 0 },
      )}>
        <input
          type="number"
          {...range}
          ref={ref}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
        />
      </label>
    </div>
    {error && <p className={styles.error}>{error.message}</p>}
  </div>
  )
})

export default NumberField;