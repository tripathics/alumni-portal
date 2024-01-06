import { forwardRef } from "react"
import styles from '../Form.module.scss'

const Checkbox = forwardRef(({ onChange, onBlur, name, label, options, required=false }, ref) => {
  return (
    !options
      ? <p>Invalid options array</p>
      : (
        <div className={styles['form-field']}>
          <label htmlFor={name}>{`${label}${required ? '' : ' (optional)'}`}</label>
          <div className={styles['radio-group']}>
            {options.map(({ label, value }, index) => (<>
              <div key={index} className={styles['checkbox-input-wrapper']}>
                <input className={styles.checkbox} type="checkbox" name={name} ref={ref} onChange={onChange} onBlur={onBlur} value={value} />
                <label className={styles['checkbox-label']} htmlFor={value}>{label}</label>
              </div>
            </>))}
          </div>
        </div>
      )
  )
})

export default Checkbox;