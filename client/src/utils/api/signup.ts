import { AxiosError } from "axios";
import axios from "../../config/axios.config";

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}
const signup = async (
  data: SignupFormData
): Promise<{ message: string; success: boolean } | undefined> => {
  try {
    const response = await axios.request({
      method: "POST",
      url: "/api/users/register",
      data: data,
    });
    return response.data;
  } catch (error) {
    switch ((error as AxiosError).response?.status) {
      case 400:
        throw (error as AxiosError<{ message: string }>).response?.data.message;
        break;
      case 401:
        console.error(error);
        break;
      default:
        console.error(error);
        break;
    }
  }
};

export default signup;
