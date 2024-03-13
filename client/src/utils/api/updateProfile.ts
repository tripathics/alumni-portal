import { PersonalDetailsType } from "@/types/Profile.type";
import { AxiosError } from "axios";
import axios from "../../config/axios.config";

const updateProfile = async (
  data: PersonalDetailsType
): Promise<
  | {
      success: boolean;
      message: string;
    }
  | undefined
> => {
  try {
    const response = await axios.request({
      method: "POST",
      url: "/api/users/update-profile",
      data: data,
    });
    return response.data;
  } catch (error) {
    switch ((error as AxiosError).response?.status) {
      case 400:
        // Handle 401 error
        throw (error as AxiosError<{ message: string }>).response?.data.message;
        break;
      case 401:
        // Handle 500 error
        console.error(error);
        break;
      default:
        console.error(error);
        break;
    }
  }
};

export default updateProfile;
