import { AxiosError } from "axios";
import axios from "../../config/axios.config";

const logout = async (): Promise<
  | {
      message: string;
      success: boolean;
    }
  | undefined
> => {
  try {
    const response = await axios.request({
      method: "POST",
      url: "/api/users/logout",
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default logout;
