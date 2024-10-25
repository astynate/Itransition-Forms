import axios from "axios";

export const instance = axios.create({
  withCredentials: true,
  baseURL: "/",
  paramsSerializer: (params) => {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  },
});

instance.interceptors.request.use(
  (config) => {
    config.headers.ItransitionAuthorization = `Bearer ${localStorage.getItem("Access-Token")}`
    return config
  }
);