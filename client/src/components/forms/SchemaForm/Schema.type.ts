interface TextField {
  type: "text" | "email" | "password";
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean | string;
}

interface SelectField {
  type: "select";
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean | string;
  options: {
    value: string;
    label: string;
  }[];
}

interface DateField {
  type: "date" | "month" | "week" | "time" | "datetime-local";
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean | string;
}

interface NumberField {
  type: "number";
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean | string;
  min?: string | number;
  max?: string | number;
}

interface RadioField {
  type: "radio";
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean | string;
  options: {
    value: string;
    label: string;
  }[];
}

interface TextareaField {
  type: "textarea";
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean | string;
}

interface FileField {
  type: "file";
  name: string;
  label: string;
  disabled?: boolean;
  required?: boolean | string;
  multiple?: boolean;
  allowedFormats: string[];
  maxFileSize?: number;
  minFileSize?: number;
}

interface SectionField {
  type: "section";
  label: string;
}

export type SchemaField =
  | TextField
  | SelectField
  | DateField
  | NumberField
  | RadioField
  | TextareaField
  | FileField
  | SectionField;
