import React from "react";
import type { Task, TaskStatus } from "@/types/task";
import type { User } from "@/types/user";
import { CheckCircle2, Clock, AlertCircle, Trash2, Edit2, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  currentUser: User | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  currentUser,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const isAdmin = currentUser?.role === "admin";
  const isOwner = String(task.userId) === String(currentUser?.id);
  const canModify = isAdmin || isOwner;

  const currentStatusStr = String(task.status);

  const statusVariant =
    currentStatusStr === "Completed"
      ? "completed"
      : currentStatusStr === "In Progress" || currentStatusStr === "In_Progress"
      ? "inProgress"
      : "pending";

  const statusIcon =
    currentStatusStr === "Completed" ? (
      <CheckCircle2 className="w-3.5 h-3.5" />
    ) : currentStatusStr === "In Progress" || currentStatusStr === "In_Progress" ? (
      <Clock className="w-3.5 h-3.5" />
    ) : (
      <AlertCircle className="w-3.5 h-3.5" />
    );

  const displayStatus = currentStatusStr === "In_Progress" ? "In Progress" : task.status;

  return (
    <Card className={`h-full flex flex-col justify-between ${!canModify ? "opacity-75" : ""}`}>
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        <div className="space-y-3">
          {/* Top Header: Status & Owner Badge */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant={statusVariant} className="flex items-center gap-1 shrink-0">
              {statusIcon} <span>{displayStatus}</span>
            </Badge>

            {isAdmin && task.user ? (
              <Badge variant="secondary" className="font-mono text-[11px] truncate max-w-[150px]">
                👤 {task.user.name || task.user.email}
              </Badge>
            ) : isOwner ? (
              <Badge variant="user" className="shrink-0">Your Task</Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 text-[10px] shrink-0">
                <Lock className="w-3 h-3" /> User #{task.userId}
              </Badge>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-100 line-clamp-2 leading-snug">
              {task.title}
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
              {task.description || <span className="italic text-zinc-600">No description provided</span>}
            </p>
          </div>
        </div>

        {/* Card Footer: Metadata & Actions */}
        <div className="pt-3 border-t border-zinc-800 space-y-3 mt-auto">
          <div className="flex justify-between items-center text-[11px] text-zinc-500 font-mono">
            <span>ID: #{task.id}</span>
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* Quick Status Action Buttons */}
            <div className="flex items-center gap-1 flex-wrap">
              {currentStatusStr !== "Pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!canModify}
                  onClick={() => onStatusChange(task, "Pending")}
                  className="h-6 text-[10px] px-2"
                  title="Move to Pending"
                >
                  Pending
                </Button>
              )}
              {currentStatusStr !== "In Progress" && currentStatusStr !== "In_Progress" && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!canModify}
                  onClick={() => onStatusChange(task, "In_Progress")}
                  className="h-6 text-[10px] px-2 text-amber-400 border-amber-800/40 hover:bg-amber-950/40"
                  title="Move to In Progress"
                >
                  In Progress
                </Button>
              )}
              {currentStatusStr !== "Completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!canModify}
                  onClick={() => onStatusChange(task, "Completed")}
                  className="h-6 text-[10px] px-2 text-emerald-400 border-emerald-800/40 hover:bg-emerald-950/40"
                  title="Move to Completed"
                >
                  Done
                </Button>
              )}
            </div>

            {/* Edit / Delete Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {canModify ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(task)}
                    className="h-7 w-7 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800"
                    title="Edit Task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(task)}
                    className="h-7 w-7 text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                    title="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              ) : (
                <span className="text-[10px] text-zinc-600 flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3" /> Read Only
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
