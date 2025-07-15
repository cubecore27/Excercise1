// react
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// style
import styles from "./css/ticket-detail.module.css";

// components
import AdminNav from "../navigation/Navigationbar";
import WorkflowTracker2 from "./components/WorkflowVisualizer2";
import ActionLogList from "./components/ActionLogList";

// hooks
import useFetchActionLogs from "./hooks/useActionLogs";
import { useWorkflowProgress } from "./hooks/useWorkflowProgress";

export default function TicketDetail() {
  const navigate = useNavigate();

  const [ticketId, setTicketId] = useState("");           // user input
  const [submittedId, setSubmittedId] = useState(null);   // actual used ticketId
  const [error, setError] = useState("");

  const { fetchActionLogs, logs } = useFetchActionLogs();
  const { tracker } = useWorkflowProgress(submittedId);

  useEffect(() => {
    if (submittedId) {
      fetchActionLogs(submittedId);
    }
  }, [submittedId]);

  const handleSearch = () => {
    if (!ticketId.trim()) {
      setError("Please enter a Ticket ID.");
      return;
    }
    setSubmittedId(ticketId.trim());
    setError("");
  };

  return (
    <>
      <AdminNav />
      <main className={styles.ticketDetailPage}>
        <section className={styles.tdpHeader}>
          <div>
            <span className={styles.tdpBack} onClick={() => navigate(-1)}>
              Tickets{" "}
            </span>
            <span className={styles.tdpCurrent}>/ Workflow Tracker</span>
          </div>
        </section>

        <section className={styles.tdpBody}>
          <div className={styles.tdpWrapper}>
            <div className={styles.tdpRightCont}>
              {/* Search Input */}
              <div className={styles.ticketSearchBar}>
                <label htmlFor="ticketId">
                  Ticket ID:
                  <span className={styles.infoIcon}
                      title="Try TX0042 — Note: newly created tickets may not show workflow tracking and action logs yet."
                      >
                    ⓘ
                  </span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="ticketId"
                    type="text"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    placeholder="e.g. TX0042"
                    className={styles.ticketInput}
                  />
                  <button onClick={handleSearch} className={styles.searchButton}>
                    Search
                  </button>
                </div>
                {error && <p className={styles.errorText}>{error}</p>}
              </div>

              {/* Workflow Tracker */}
              {submittedId && (
                <>
                  <WorkflowTracker2 workflowData={tracker} />
                  <div className={styles.actionLogs}>
                    <h4>Action Logs</h4>
                    <ActionLogList logs={logs} />
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
