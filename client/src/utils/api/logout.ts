import axios from "axios";

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
