import { FieldValues, useForm } from "react-hook-form";
import { TextField, Select, Radio, Button, DateField, NumberField } from "..";
import styles from "../Form.module.scss";
import Textarea from "../Textarea/Textarea";
import FileInput from "../FileInput/FileInput";
import { SchemaField } from "./Schema.type";
import FormSectionSection from "../FormSectionHeading";

interface SchemaFormProps {
  schema: SchemaField[];
  onSubmit: (data: FieldValues) => void;
  actions?: React.ReactNode;
  loading?: boolean;
  prefillData?: FieldValues;
}
const SchemaForm: React.FC<SchemaFormProps> = ({
  schema,
  onSubmit,
  actions = null,
  loading = false,
  prefillData,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: prefillData,
  });

  if (loading) {
    return <p>Please wait...</p>;
  }

  if (!schema || schema.length === 0 || !onSubmit) {
    return <p>Invalid form</p>;
  }

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      {schema.map((field, index) => {
        if (
          field.type === "text" ||
          field.type === "email" ||
          field.type === "password"
        ) {
          return (
            <TextField
              key={index}
              type={field.type}
              label={field.label}
              required={field.required}
              {...register(field.name, { required: field.required })}
              value={watch(field.name)}
              error={errors[field.name]}
              disabled={field.disabled}
            />
          );
        } else if (field.type === "select") {
          return (
            <Select
              key={index}
              label={field.label}
              required={field.required}
              options={field.options}
              error={errors[field.name]}
              {...register(field.name, { required: field.required })}
              disabled={field.disabled}
            />
          );
        } else if (field.type === "date") {
          return (
            <DateField
              key={index}
              label={field.label}
              {...register(field.name, { required: field.required })}
              required={field.required}
              error={errors[field.name]}
              disabled={field.disabled}
            />
          );
        } else if (field.type === "number") {
          return (
            <NumberField
              key={index}
              label={field.label}
              {...register(field.name, { required: field.required })}
              required={field.required}
              value={watch(field.name)}
              error={errors[field.name]}
              disabled={field.disabled}
            />
          );
        } else if (field.type === "radio") {
          return (
            <Radio
              key={index}
              label={field.label}
              {...register(field.name, { required: field.required })}
              required={field.required}
              options={field.options}
              error={errors[field.name]}
            />
          );
        } else if (field.type === "textarea") {
          return (
            <Textarea
              key={index}
              label={field.label}
              {...register(field.name, { required: field.required })}
              required={field.required}
              error={errors[field.name]}
              value={watch(field.name)}
              disabled={field.disabled}
            />
          );
        } else if (field.type === "file") {
          const file = watch(field.name);

          return (
            <div key={index} className={styles["field-wrapper"]}>
              {Array.isArray(file) && file.length > 0 && (
                <div className={styles["image-preview"]}>
                  {file.map((f, _) => (
                    <div key={_} className={styles["image"]}>
                      <img src={URL.createObjectURL(f)} alt={f.name} />
                    </div>
                  ))}
                </div>
              )}
              <FileInput
                name={field.name}
                label={field.label}
                control={control}
                watch={watch}
                multiple={!!field?.multiple}
                required={field.required}
                error={errors[field.name]}
                maxFileSize={field.maxFileSize}
                minFileSize={field.minFileSize}
                allowedFormats={field.allowedFormats}
              />
            </div>
          );
        } else if (field.type === "section") {
          return (
            <FormSectionSection label={field.label} key={index} />
          );
        } else {
          return <p key={index}>Invalid field</p>;
        }
      })}
      {actions !== null ? (
        actions
      ) : (
        <Button type="submit" className="primary">
          Submit
        </Button>
      )}
    </form>
  );
};

export default SchemaForm;
