import React from "react";
import type { User } from "@/types/user";
import { Plus, Shield, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkspaceBannerProps {
  user: User | null;
  onOpenCreate: () => void;
}

export const WorkspaceBanner: React.FC<WorkspaceBannerProps> = ({
  user,
  onOpenCreate,
}) => {
  const isAdmin = user?.role === "admin";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge
              variant={isAdmin ? "admin" : "user"}
              className="uppercase tracking-wider"
            >
              {isAdmin ? (
                <Shield className="w-3 h-3 mr-1" />
              ) : (
                <UserIcon className="w-3 h-3 mr-1" />
              )}
              {user?.role} Workspace
            </Badge>
            <span className="text-xs text-zinc-400 font-mono">
              User ID: #{user?.id}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isAdmin ? "Admin Task Panel" : "My Task Dashboard"}
          </h1>
          <p className="text-xs text-zinc-400">
            {isAdmin
              ? "Admin permissions: View, create, update, or delete tasks across all users."
              : "User permissions: Manage your own tasks. Access to other users' tasks is restricted."}
          </p>
        </div>

        <Button
          onClick={onOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Create Task
        </Button>
      </div>
    </div>
  );
};
