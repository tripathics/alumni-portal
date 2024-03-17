import { AxiosError } from "axios";
import axios from "../../config/axios.config";
import { UserType } from "@/types/User.type";
import { toast } from "react-toastify";

const readUser = async (): Promise<
  | {
      success: boolean;
      message: string;
      user?: UserType;
    }
  | undefined
> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: "/api/users/u",
    });
    return response.data;
  } catch (error) {
    if (
      (error as AxiosError<{ message: string }>).response?.data.message !==
      "Token not found"
    ) {
      console.error(error);
      toast.error("Unauthorized, please login again");
    }
  }
};

export default readUser;
