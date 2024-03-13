import { AxiosError } from "axios";
import axios from "../../config/axios.config";
import { UserType } from "@/types/User.type";

const readUser = async (
  id?: string
): Promise<
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
      url: "/api/users",
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default readUser;
