import styles from '../Form.module.scss'
import { forwardRef } from 'react'

const Select = forwardRef(({ onChange, onBlur, name, label, options, required = false, disabled=false, error }, ref) => {
  return (
    !options || !Array.isArray(options)
      ? <p>Invalid options array</p>
      : (
        <div className={styles['field-wrapper']}>
          <div className={styles['form-field']}>
            <label htmlFor={name}>{`Select ${label.toLowerCase()}${required ? '' : ' (optional)'}`}</label>
            <select disabled={disabled} name={name} ref={ref} onChange={onChange} onBlur={onBlur} defaultValue="">
              <option value="" disabled>{label}..</option>
              {options.map(({ label, value }, index) => (
                <option key={index} value={value}>{label}</option>
              ))}
            </select>
          </div>
          {error && (
            !error.length
              ? <p className={styles.error}>{error.message}</p>
              : error.map((err, index) => (
                <p key={index} className={styles.error}>{err.message}</p>
              ))
          )}
        </div>
      )
  )
})

export default Select;