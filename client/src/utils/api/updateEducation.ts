import { AxiosError } from "axios";
import axios from "../../config/axios.config";
import { EducationType } from "@/types/Profile.type";

const updateEducation = async (
  data: EducationType
): Promise<
  | {
      message: string;
      success: boolean;
    }
  | undefined
> => {
  try {
    const response = await axios.request({
      method: "POST",
      url: "/api/users/education",
      data: data,
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

export default updateEducation;
