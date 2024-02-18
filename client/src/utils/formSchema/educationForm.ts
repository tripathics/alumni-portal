import { SchemaField } from "@/components/forms/SchemaForm/Schema.type";

export const educationFormNITAPSchema: SchemaField[] = [
  {
    name: "institute",
    label: "Institute",
    type: "text",
    required: "Institute is requried",
    disabled: true,
  },
  {
    name: "degree",
    label: "Degree",
    type: "select",
    required: "Degree is required",
    options: [
      { value: "btech", label: "B.Tech" },
      { value: "mtech", label: "M.Tech" },
      { value: "phd", label: "PhD" },
    ],
  },
  {
    name: "type",
    label: "Degree type",
    type: "select",
    options: [
      { value: "full-time", label: "Full time" },
      { value: "part-time", label: "Part time" },
    ],
    required: "Degree type is required",
  },
  {
    name: "discipline",
    label: "Discipline (Field of study)",
    type: "text",
    required: "Discipline is required",
  },
  {
    name: "startDate",
    label: "Start date",
    type: "date",
    required: "Start date is required",
  },
  {
    name: "endDate",
    label: "End date",
    type: "date",
    required: "End date is required",
  },
  { name: "description", label: "Description", type: "textarea" },
];
export const educationFormSchema: SchemaField[] = [
  {
    name: "institute",
    label: "Institute (Ex. IIT Madras)",
    type: "text",
    required: "Institute is requried",
  },
  {
    name: "degree",
    label: "Degree",
    type: "text",
    required: "Degree is required",
  },
  {
    name: "type",
    label: "Degree type",
    type: "select",
    options: [
      { value: "full-time", label: "Full time" },
      { value: "part-time", label: "Part time" },
    ],
    required: "Degree type is required",
  },
  {
    name: "discipline",
    label: "Discipline (Field of study)",
    type: "text",
    required: "Discipline is required",
  },
  {
    name: "startDate",
    label: "Start date",
    type: "date",
    required: "Start date is required",
  },
  {
    name: "endDate",
    label: "End date (or expected)",
    type: "date",
    required: "End date is required",
  },
  { name: "description", label: "Description", type: "textarea" },
];
