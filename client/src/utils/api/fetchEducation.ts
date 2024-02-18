import axios, { AxiosError } from "axios";
import { EducationType } from "@/types/Profile.type";

const fetchEducation = async (): Promise<
  | { message: string; success: boolean; educationList?: EducationType[] }
  | undefined
> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: "/api/users/education",
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      throw "Unauthorized";
    } else {
      console.error(error);
    }
  }
};

export default fetchEducation;
