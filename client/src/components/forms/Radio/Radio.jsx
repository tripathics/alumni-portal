import { forwardRef } from "react"
import styles from '../Form.module.scss'

const Radio = forwardRef(({ onChange, onBlur, name, label, options, required = false, error }, ref) => {
  return (
    !options
      ? <p>Invalid options array</p>
      : (<div className={styles['field-wrapper']}>
        <div className={styles['form-field']}>
          <label htmlFor={name}>{`${label}${required ? '' : ' (optional)'}`}</label>
          <div className={styles['radio-group']}>
            {options.map(({ label, value }, index) => (<>
              <div key={index} className={styles['radio-option']}>
                <input className={styles.radio} type="radio" name={name} ref={ref} onChange={onChange} onBlur={onBlur} value={value} />
                <label className={styles['radio-label']} htmlFor={value}>{label}</label>
              </div>
            </>))}
          </div>
        </div>
        {error && <p className={styles.error}>{error.message}</p>}
      </div>)
  )
})

export default Radio;