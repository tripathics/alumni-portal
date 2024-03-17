import { SchemaField } from "@/components/forms/SchemaForm/Schema.type";

const experienceFormSchema: SchemaField[] = [
  { type: "section", label: "Professional Details" },
  {
    name: "type",
    label: "Type",
    type: "select",
    required: "Type is required",
    options: [
      { value: "job", label: "Job" },
      { value: "internship", label: "Internship" },
    ],
  },
  {
    name: "organisation",
    label: "Company/Organization",
    type: "text",
    required: "Company/organization name is required",
  },
  {
    name: "designation",
    label: "Designation/Role",
    type: "text",
    required: "Designation is required",
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    required: "Location is required",
  },
  {
    name: "start_date",
    label: "Start date",
    type: "date",
    required: "Start date is required",
  },
  {
    name: "end_date",
    label: "End date (leave empty if this is your current job)",
    type: "date",
  },
  { name: "ctc", label: "CTC in LPA", type: "number" },
  { name: "description", label: "Description", type: "textarea" },
];

export default experienceFormSchema;
