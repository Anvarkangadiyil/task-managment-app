import React, { useState } from "react";
import type { Task } from "@/types/task";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  error?: string | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  task,
  onClose,
  onConfirm,
  error,
}) => {
  const [submitting, setSubmitting] = useState(false);

  if (!task) return null;

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = (
    <span className="flex items-center gap-2 text-red-400">
      <Trash2 className="w-5 h-5" /> Delete Task
    </span>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} className="max-w-md">
      <div className="space-y-4">
        <p className="text-sm text-zinc-300">
          Are you sure you want to delete task{" "}
          <span className="font-semibold text-white">"{task.title}"</span>? This action cannot be undone.
        </p>

        {error && (
          <Alert variant="destructive" className="bg-red-950/40 border-red-900 text-red-200">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-xs font-medium ml-2">{error}</AlertDescription>
          </Alert>
        )}

        <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
              </>
            ) : (
              "Delete Permanently"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
