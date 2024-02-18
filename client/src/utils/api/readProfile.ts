import axios from "axios";

const readProfile = async () => {
  try {
    const response = await axios.request({
      method: "GET",
      url: "/api/users/profile",
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default readProfile;
