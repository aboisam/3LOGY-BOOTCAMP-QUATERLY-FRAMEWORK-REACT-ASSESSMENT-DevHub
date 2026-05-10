/** @format */

// All resource API calls live here — same pattern as snippetService
import api from "./api";

// Fetch every resource belonging to the logged-in user
const getAll = async () => {
  try {
    const response = await api.get("/api/resources");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch resources" };
  }
};

// Fetch a single resource by ID
const getById = async (id) => {
  try {
    const response = await api.get(`/api/resources/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch resource" };
  }
};

// Create a new resource and return the server-assigned object
const create = async (data) => {
  try {
    const response = await api.post("/api/tasks", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create resource" };
  }
};

// Replace an existing resource's data entirely
const update = async (id, data) => {
  try {
    const response = await api.put(`/api/resources/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update resource" };
  }
};

// Delete a resource permanently
const remove = async (id) => {
  try {
    const response = await api.delete(`/api/resources/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete resource" };
  }
};

export default { getAll, getById, create, update, remove };
