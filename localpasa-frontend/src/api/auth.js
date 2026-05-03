import client from "./client";

export const register = (data) => client.post("/auth/register", data);
export const login = (data) => client.post("/auth/login", data);
export const refreshTokens = (refreshToken) =>
  client.post("/auth/refresh", { refreshToken });
export const getme = () => client.get("/auth/me");
export const logout = (refreshToken) =>
  client.post("/auth/logout", { refreshToken });
