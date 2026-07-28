import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { WorkspaceBanner } from "@/components/dashboard/WorkspaceBanner";
import { TaskFilterToolbar } from "@/components/dashboard/TaskFilterToolbar";
import { TaskList } from "@/components/dashboard/TaskList";
import { TaskModal } from "@/components/TaskModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "@/services/taskService";
import type { Task, TaskStatus, PaginationMeta } from "@/types/task";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Query Params & Pagination State
  const [page, setPage] = useState<number>(1);
  const limit = 6;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [userFilter, setUserFilter] = useState<string>("ALL");

  const [pagination, setPagination] = useState<PaginationMeta>({
    totalTasks: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modal Visibility State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const isAdmin = user?.role === "admin";

  // Fetch tasks with query parameters
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTasksApi({
        page,
        limit,
        search: searchQuery.trim() || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        userId: isAdmin && userFilter !== "ALL" ? userFilter : undefined,
      });

      if (res.success) {
        setTasks(res.tasks);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch tasks"
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter, userFilter, isAdmin]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Search & Filter Handlers (Reset Page to 1)
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleUserFilterChange = (val: string) => {
    setUserFilter(val);
    setPage(1);
  };

  // Extract unique users list for Admin filter
  const uniqueUsers = useMemo(() => {
    const map = new Map<number, { id: number; name: string; email: string }>();
    tasks.forEach((t) => {
      if (t.user && t.user.id) {
        const uid = Number(t.user.id);
        if (!map.has(uid)) {
          map.set(uid, {
            id: uid,
            name: t.user.name || "User",
            email: t.user.email,
          });
        }
      }
    });
    return Array.from(map.values());
  }, [tasks]);

  // Modal Handlers
  const handleOpenCreate = () => {
    setEditingTask(null);
    setActionError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    if (!isAdmin && String(task.userId) !== String(user?.id)) {
      setActionError("Access Denied: You can only update your own tasks.");
      setTimeout(() => setActionError(null), 4000);
      return;
    }
    setEditingTask(task);
    setActionError(null);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (data: {
    title: string;
    description?: string;
    status: TaskStatus;
  }) => {
    try {
      setActionError(null);
      if (editingTask) {
        const res = await updateTaskApi(editingTask.id, data);
        if (res.success) {
          setActionSuccess("Task updated successfully!");
          setIsModalOpen(false);
          fetchTasks();
        }
      } else {
        const res = await createTaskApi(data);
        if (res.success) {
          setActionSuccess("Task created successfully!");
          setIsModalOpen(false);
          fetchTasks();
        }
      }
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      setActionError(
        err.response?.data?.message || err.message || "Failed to save task"
      );
    }
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (!isAdmin && String(task.userId) !== String(user?.id)) {
      setActionError("Forbidden: You can only modify your own tasks.");
      setTimeout(() => setActionError(null), 4000);
      return;
    }

    try {
      setActionError(null);
      const res = await updateTaskApi(task.id, { status: newStatus });
      if (res.success) {
        fetchTasks();
      }
    } catch (err: any) {
      setActionError(
        err.response?.data?.message || err.message || "Failed to update status"
      );
      setTimeout(() => setActionError(null), 4000);
    }
  };

  const handleOpenDelete = (task: Task) => {
    if (!isAdmin && String(task.userId) !== String(user?.id)) {
      setActionError("Access Denied: You can only delete your own tasks.");
      setTimeout(() => setActionError(null), 4000);
      return;
    }
    setDeletingTask(task);
    setActionError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      setActionError(null);
      const res = await deleteTaskApi(deletingTask.id);
      if (res.success) {
        setDeletingTask(null);
        setActionSuccess("Task deleted successfully!");
        setTimeout(() => setActionSuccess(null), 4000);
        fetchTasks();
      }
    } catch (err: any) {
      setActionError(
        err.response?.data?.message || err.message || "Failed to delete task"
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Workspace Banner */}
        <WorkspaceBanner user={user} onOpenCreate={handleOpenCreate} />

        {/* Feedback Notifications */}
        {actionSuccess && (
          <Alert className="bg-emerald-950/40 border-emerald-800 text-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <AlertDescription className="text-sm font-medium ml-2">
              {actionSuccess}
            </AlertDescription>
          </Alert>
        )}

        {actionError && (
          <Alert
            variant="destructive"
            className="bg-red-950/40 border-red-900 text-red-200"
          >
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-sm font-medium ml-2 flex justify-between items-center w-full">
              <span>{actionError}</span>
              <button
                onClick={() => setActionError(null)}
                className="text-red-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Search & Filter Toolbar Component */}
        <TaskFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          userFilter={userFilter}
          onUserFilterChange={handleUserFilterChange}
          isAdmin={isAdmin}
          uniqueUsers={uniqueUsers}
        />

        {/* Task List Grid & Pagination Component */}
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          currentUser={user}
          pagination={pagination}
          onPageChange={setPage}
          onEditTask={handleOpenEdit}
          onDeleteTask={handleOpenDelete}
          onStatusChange={handleStatusChange}
          onOpenCreate={handleOpenCreate}
          onRetry={fetchTasks}
        />
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
        error={actionError}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        error={actionError}
      />
    </div>
  );
};
