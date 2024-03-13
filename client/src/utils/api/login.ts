import { UserType } from "@/types/User.type";
import { AxiosError } from "axios";
import axios from "../../config/axios.config";

const login = async (loginFormData: {
  email: string;
  password: string;
}): Promise<
  | {
      success: boolean;
      message: string;
      user?: UserType;
    }
  | undefined
> => {
  try {
    const response = await axios.request({
      method: "POST",
      url: "/api/users/login",
      data: loginFormData,
    });
    return response.data;
  } catch (error) {
    if (
      (error as AxiosError<{ message: string; success: boolean }>)?.response
        ?.data.message
    ) {
      const errorMessage = (
        error as AxiosError<{ message: string; success: boolean }>
      ).response?.data.message;
      throw errorMessage;
    } else {
      console.error(error);
    }
  }
};

export default login;
