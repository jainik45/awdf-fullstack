import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { getTasks, createTask, updateTask, deleteTask, getMe } from "../api";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { lazyWithDelay } from "../utils/lazyWithDelay";
import "./Projects.css";

// Lazy-loaded TaskStats component with delay wrapper
const TaskStats = lazyWithDelay(() => import("../components/TaskStats"), 300);

export default function Projects() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch authenticated user profile
  useEffect(() => {
    getMe()
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  // Fetch all tasks from backend API
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load tasks from server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // runWrite helper wrapping every write in try/catch, busy flag, toast, then re-fetching
  const runWrite = async (operation, successMessage) => {
    try {
      setBusy(true);
      await operation();
      setToast({ message: successMessage, type: "success" });
      await loadTasks();
      return true;
    } catch (err) {
      setToast({
        message: err.message || "Operation failed",
        type: "error",
      });
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleCreateTask = useCallback(
    async (taskData, resetForm) => {
      const success = await runWrite(() => createTask(taskData), "Task created successfully!");
      if (success && resetForm) {
        resetForm();
      }
    },
    [loadTasks]
  );

  const handleToggleCompleted = async (id, completed) => {
    await runWrite(
      () => updateTask(id, { completed }),
      completed ? "Task marked as completed!" : "Task marked as pending."
    );
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    const id = taskToDelete._id || taskToDelete.id;
    setTaskToDelete(null);
    await runWrite(() => deleteTask(id), "Task deleted successfully!");
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h2>Task Management</h2>
          <p style={{ margin: "0.25rem 0 0 0", opacity: 0.8 }}>
            Full-stack Task Manager connected to Express and MongoDB
          </p>
        </div>
        {user && user.email && (
          <div
            className="user-badge"
            style={{
              padding: "0.4rem 0.85rem",
              borderRadius: "20px",
              backgroundColor: "rgba(37, 99, 235, 0.1)",
              border: "1px solid rgba(37, 99, 235, 0.3)",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Logged in as <strong>{user.email}</strong>
          </div>
        )}
      </div>

      {/* Lazy-loaded TaskStats inside its own Suspense */}
      <Suspense fallback={<Spinner message="Loading statistics..." />}>
        <TaskStats tasks={tasks} />
      </Suspense>

      <TaskForm onSubmit={handleCreateTask} busy={busy} />

      {loading && <Spinner message="Loading tasks..." />}

      {error && !loading && (
        <ErrorMessage message={error} onRetry={loadTasks} />
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="empty-state">
          <h4>No tasks found</h4>
          <p>Get started by creating your first task above.</p>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="task-list">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            Tasks ({tasks.length})
          </h3>
          {tasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onToggleCompleted={handleToggleCompleted}
              onRequestDelete={(t) => setTaskToDelete(t)}
              busy={busy}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        message={
          taskToDelete
            ? `Are you sure you want to delete "${taskToDelete.title}"?`
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
