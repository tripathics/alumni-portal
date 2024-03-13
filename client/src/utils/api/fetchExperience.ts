import { AxiosError } from "axios";
import axios from "../../config/axios.config";
import { ExperienceType } from "@/types/Profile.type";

const fetchExperiences = async (): Promise<
  | { message: string; success: boolean; experienceList?: ExperienceType[] }
  | undefined
> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: "/api/users/experience",
    });
    return response.data;
  } catch (error) {
    if ((error as AxiosError).response?.status === 401) {
      throw "Unauthorized";
    } else {
      if ((error as AxiosError).response?.status === 401) {
        throw "Unauthorized";
      } else {
        console.error(error);
      }
    }
  }
};

export default fetchExperiences;
