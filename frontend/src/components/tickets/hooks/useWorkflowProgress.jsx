// hooks/useWorkflowProgress.js
import { useState, useEffect } from "react";
import api from "../api/axios"; // your custom axios instance

export function useWorkflowProgress(ticket_id) {
  const [tracker, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ticket_id) return;

    setLoading(true);

    api
      .get(`/action_log/progress/?ticket_id=${ticket_id}`)
      .then((res) => {
        console.log("✅ API response:", res.data);
        setData(res.data); // <-- fix this line!
      })
      .catch((err) => {
        console.error("❌ API error:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [ticket_id]);

  return { tracker, loading, error };
}
