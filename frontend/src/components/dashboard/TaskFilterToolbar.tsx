import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface TaskFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  userFilter: string;
  onUserFilterChange: (value: string) => void;
  isAdmin: boolean;
  uniqueUsers: Array<{ id: number; name: string; email: string }>;
}

export const TaskFilterToolbar: React.FC<TaskFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  userFilter,
  onUserFilterChange,
  isAdmin,
  uniqueUsers,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Title Search Input */}
      <div className="md:col-span-6 relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search tasks by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800"
        />
      </div>

      {/* Status Filter Dropdown */}
      <div className="md:col-span-3 flex items-center gap-2">
        <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
        <Select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="bg-zinc-900 border-zinc-800 text-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In_Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Select>
      </div>

      {/* Admin User Filter Dropdown */}
      {isAdmin && (
        <div className="md:col-span-3">
          <Select
            value={userFilter}
            onChange={(e) => onUserFilterChange(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-sm"
          >
            <option value="ALL">All Users ({uniqueUsers.length})</option>
            {uniqueUsers.map((u) => (
              <option key={u.id} value={String(u.id)}>
                {u.name} ({u.email})
              </option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};
