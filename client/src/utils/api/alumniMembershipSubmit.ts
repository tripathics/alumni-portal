import { AxiosError } from "axios";
import axios from "../../config/axios.config";

const alumniMembershipSubmit = async (
  data: FormData
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
      url: "/api/alumni/membership",
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

export default alumniMembershipSubmit;
