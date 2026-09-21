import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "/api/url",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    if ([201, 200].includes(response.status)) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    if ([400, 401, 500.404].includes(error.response?.status)) {
      toast.error(error.response.data.error);
    }

    return error;
  },
);

export default api;
