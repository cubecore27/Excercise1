// src/api/useFetchActionLogs.js
import { useState } from 'react';
import api from '../api/axios'; // your pre-configured axios instance

const useFetchActionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActionLogs = async (ticket_id) => {
    if (!ticket_id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/action_log/action-logs/', {
        params: { ticket_id: ticket_id },
      });
      setLogs(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'An error occurred.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchActionLogs,
    logs,
    loading,
    error,
  };
};

export default useFetchActionLogs;


