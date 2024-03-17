import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  undefined,
  function axiosRetryInterceptor(err) {
    if (!err.response) {
      toast.error("Network Error", {
        position: "bottom-center",
        autoClose: 5000,
      });
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
