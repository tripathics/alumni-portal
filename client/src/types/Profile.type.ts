export interface PersonalDetailsType {
  userId: string;
  title: "mr" | "mrs" | "ms" | "dr";
  firstName: string;
  lastName: string | null;
  dob: string;
  sex: "male" | "female" | "others";
  category: "gen" | "obc" | "sc" | "st" | "ews" | "others";
  nationality: string;
  religion: string | null;
  address: string;
  pincode: string;
  state: string;
  city: string;
  country: string;
  phone: string;
  altPhone: string | null;
  altEmail: string | null;
  linkedin: string | null;
  github: string | null;
  registrationNo: string;
  rollNo: string;
  sign: string | null;
  avatar: string | null;
}

export interface EducationType {
  id: string;
  institute: string;
  degree: string;
  type: "part-time" | "full-time";
  discipline: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExperienceType {
  id: string;
  type: "job" | "internship";
  organization: string;
  designation: string;
  location: string;
  startDate: string;
  endDate: string;
  ctc: number;
  description: string;
}
