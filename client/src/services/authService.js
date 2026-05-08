/** @format */

import api from "./api";

const authService = {
  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password });
    // Now we can do sync operations here
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  },

  logout: () => {
    localStorage.clear();
    window.location.href = "/login";
  },

  isLoggedIn: () => {
    return (
      localStorage.getItem("token") !== null &&
      localStorage.getItem("user") !== null
    );
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  getProfile: async () => {
    const response = await api.get("/api/auth/profile");
    return response.data;
  },
};

export default authService;
