/** @format */

// All task API calls live here
import api from "./api";

// Fetch every task belonging to the logged-in user
const getAll = async () => {
  try {
    const response = await api.get("/api/tasks");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch tasks" };
  }
};

// Fetch a single task by ID
const getById = async (id) => {
  try {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch task" };
  }
};

// Create a new task and return the server-assigned object
const create = async (data) => {
  try {
    const response = await api.post("/api/tasks", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create task" };
  }
};

// Replace an existing task's data entirely
const update = async (id, data) => {
  try {
    const response = await api.put(`/api/tasks/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update task" };
  }
};

// Quick status toggle — PATCH /api/tasks/{id}/status
const updateStatus = async (id, status) => {
  try {
    const response = await api.patch(`/api/tasks/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update task status" };
  }
};

// Delete a task permanently
const remove = async (id) => {
  try {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete task" };
  }
};

export default { getAll, getById, create, update, updateStatus, remove };

