export interface PersonalDetailsType {
  user_id: string;
  title: "mr" | "mrs" | "ms" | "dr";
  first_name: string;
  last_name: string;
  email: string;
  role: string[];
  dob: string;
  sex: "male" | "female" | "others";
  category: "gen" | "obc" | "sc" | "st" | "others";
  nationality: string;
  religion: string | null;
  address: string;
  pincode: string;
  state: string;
  city: string;
  country: string;
  phone: string;
  alt_phone: string | null;
  alt_email: string | null;
  linkedin: string | null;
  github: string | null;
  registration_no: string;
  roll_no: string;
  sign: string | null;
  avatar: string | null;
  profile_locked: boolean | null;
}

export interface EducationType {
  id: string;
  institute: string;
  degree: string;
  type: "part-time" | "full-time";
  discipline: string;
  start_date: string;
  end_date: string;
  description: string | null;
}

export interface ExperienceType {
  id: string;
  type: "job" | "internship";
  organization: string;
  designation: string;
  location: string;
  start_date: string;
  end_date: string | null;
  ctc: number;
  description: string | null;
}
