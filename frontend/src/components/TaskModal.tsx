import React, { useState, useEffect } from "react";
import type { Task, TaskStatus } from "@/types/task";
import { Plus, Edit2, Loader2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string; status: TaskStatus }) => Promise<void>;
  initialTask?: Task | null;
  error?: string | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  error,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Pending");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      const formattedStatus =
        String(initialTask.status) === "In_Progress" ? "In Progress" : initialTask.status;
      setStatus(formattedStatus);
    } else {
      setTitle("");
      setDescription("");
      setStatus("Pending");
    }
  }, [initialTask, isOpen]);

  const isEdit = !!initialTask;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = isEdit ? (
    <>
      <Edit2 className="w-5 h-5 text-indigo-400" /> Edit Task #{initialTask.id}
    </>
  ) : (
    <>
      <Plus className="w-5 h-5 text-indigo-400" /> Create Task
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-950/40 border-red-900 text-red-200">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-xs font-medium ml-2">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="task-title">Task Title *</Label>
          <Input
            id="task-title"
            placeholder="e.g. Implement Authorization Rules"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-950 border-zinc-800"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-description">Description</Label>
          <textarea
            id="task-description"
            rows={3}
            placeholder="Detailed task description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-status">Status</Label>
          <Select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="bg-zinc-950 border-zinc-800"
          >
            <option value="Pending">Pending</option>
            <option value="In_Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || !title.trim()}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Task"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
