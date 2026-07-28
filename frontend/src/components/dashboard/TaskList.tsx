import React from "react";
import type { Task, TaskStatus, PaginationMeta } from "@/types/task";
import type { User } from "@/types/user";
import { TaskCard } from "@/components/TaskCard";
import {
  Loader2,
  AlertCircle,
  CheckSquare,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  currentUser: User | null;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
  onOpenCreate: () => void;
  onRetry: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  error,
  currentUser,
  pagination,
  onPageChange,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onOpenCreate,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="min-h-[250px] flex flex-col items-center justify-center space-y-2">
        <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
        <p className="text-xs text-zinc-500">Querying database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 text-center space-y-2">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="text-sm text-red-200">{error}</p>
        <Button size="sm" onClick={onRetry} variant="outline">
          Retry Query
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl p-10 text-center space-y-3">
        <CheckSquare className="w-8 h-8 text-zinc-500 mx-auto" />
        <p className="text-sm text-zinc-400">No tasks found matching criteria.</p>
        <Button size="sm" onClick={onOpenCreate}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Create Task
        </Button>
      </div>
    );
  }

  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.totalTasks);

  return (
    <div className="space-y-6">
      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            currentUser={currentUser}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400">
        <div>
          <span>
            Showing <strong className="text-zinc-200">{startItem}</strong> to{" "}
            <strong className="text-zinc-200">{endItem}</strong> of{" "}
            <strong className="text-zinc-200">{pagination.totalTasks}</strong> tasks
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!pagination.hasPrevPage}
            onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
            className="h-8 px-2.5 gap-1 text-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          <span className="px-3 font-mono font-semibold text-zinc-200">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() => onPageChange(pagination.page + 1)}
            className="h-8 px-2.5 gap-1 text-xs cursor-pointer"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
