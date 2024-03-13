import { AxiosError } from "axios";
import axios from "../../config/axios.config";

const checkAuth = async (): Promise<
  | {
      message: string;
      success: boolean;
    }
  | undefined
> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: "/api/users/auth",
    });
    return response.data;
  } catch (error) {
    if ((error as AxiosError).status === 401) {
      throw "Unauthorized";
    } else {
      console.error(error);
    }
  }
};

export default checkAuth;
