import { createContext, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleError = (error) => {
    toast.error(error.response?.data?.message || 'Something went wrong');
    throw error;
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async (payload, id) => {
    try {
      const { data } = id ? await api.put(`/projects/${id}`, payload) : await api.post('/projects', payload);
      await fetchProjects();
      toast.success(id ? 'Project updated' : 'Project created');
      return data;
    } catch (error) {
      return handleError(error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects((items) => items.filter((item) => item._id !== id));
      toast.success('Project deleted');
    } catch (error) {
      handleError(error);
    }
  };

  const fetchTasks = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks', { params });
      setTasks(data);
      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const saveTask = async (payload, id) => {
    try {
      const { data } = id ? await api.put(`/tasks/${id}`, payload) : await api.post('/tasks', payload);
      setTasks((items) => id ? items.map((item) => item._id === id ? data : item) : [data, ...items]);
      toast.success(id ? 'Task updated' : 'Task created');
      return data;
    } catch (error) {
      return handleError(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((items) => items.filter((item) => item._id !== id));
      toast.success('Task deleted');
    } catch (error) {
      handleError(error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
      return data;
    } catch (error) {
      return handleError(error);
    }
  };

  const value = useMemo(() => ({
    projects, tasks, stats, loading, fetchProjects, saveProject, deleteProject, fetchTasks, saveTask, deleteTask, fetchStats
  }), [projects, tasks, stats, loading]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
