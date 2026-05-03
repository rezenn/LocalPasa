import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../constants/config";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original.retry) {
      original._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        await AsyncStorage.setItem("accessToken", data.data.accessToken);
        await AsyncStorage.setItem("refreshToken", data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return client(original);
      } catch {
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      }
    }
    return Promise.reject(error);
  },
);

export default client;
