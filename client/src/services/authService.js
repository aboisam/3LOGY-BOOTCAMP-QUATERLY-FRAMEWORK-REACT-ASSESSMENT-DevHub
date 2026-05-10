/** @format */

// All authentication API calls are centralised here
import api from "./api";

// Send login credentials and save the returned token to localStorage
const login = async (email, password) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

// Register a new user account — no token saved, user must log in after
const register = async (userName, email, password) => {
  try {
    const response = await api.post("/api/auth/register", {
      userName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};

// Clear the token from localStorage to end the session
const logout = () => {
  localStorage.removeItem("token");
};

// Read the token from localStorage — returns null if not logged in
const getToken = () => {
  return localStorage.getItem("token");
};

// Fetch the logged-in user's profile using the stored token
const getProfile = async () => {
  try {
    const response = await api.get("/api/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch profile" };
  }
};

export default { login, register, logout, getToken, getProfile };
