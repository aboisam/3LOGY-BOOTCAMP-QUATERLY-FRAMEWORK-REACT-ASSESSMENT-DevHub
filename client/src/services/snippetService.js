/** @format */

// All snippet API calls live here — components import these functions instead of calling axios directly
import api from "./api";

// Fetch every snippet belonging to the logged-in user
const getAll = async () => {
  try {
    const response = await api.get("/api/snippets");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch snippets" };
  }
};

// Fetch a single snippet by its ID — used on the detail page
const getById = async (id) => {
  try {
    const response = await api.get(`/api/snippets/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch snippet" };
  }
};

// Send a new snippet to the API and return the created object with its server-assigned ID
const create = async (data) => {
  try {
    const response = await api.post("/api/snippets", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create snippet" };
  }
};

// Replace an existing snippet's data — PUT replaces the whole resource
const update = async (id, data) => {
  try {
    const response = await api.put(`/api/snippets/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update snippet" };
  }
};

// Delete a snippet permanently — the list is updated in the page component after this resolves
const remove = async (id) => {
  try {
    const response = await api.delete(`/api/snippets/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete snippet" };
  }
};

export default { getAll, getById, create, update, remove };
