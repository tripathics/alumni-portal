import axios, { AxiosError } from "axios";
import { MembershipPrefillDataType } from "@/types/Alumni.type";

const alumniPrefill = async (): Promise<
  | {
      success: boolean;
      message?: string;
      data?: MembershipPrefillDataType;
    }
  | undefined
> => {
  try {
    const response = await axios.request({
      method: "GET",
      url: "/api/alumni/membership-prefill",
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

export default alumniPrefill;
