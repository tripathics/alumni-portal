import { AxiosError } from "axios";
import axios from "../../config/axios.config";

const updateAvatar = async (
  file: File
): Promise<
  | {
      success: boolean;
      message: string;
    }
  | undefined
> => {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await axios.patch("/api/users/update-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    // Handle the error here
    console.error(error);
  }
};

export default updateAvatar;
