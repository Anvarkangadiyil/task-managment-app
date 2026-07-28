import React from "react";
import { Link } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const NavBrand: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
        <CheckSquare className="w-5 h-5 text-white" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-white tracking-tight">
          TaskManager
        </span>
        <Badge variant="outline" className="hidden sm:inline-flex text-[10px] uppercase font-mono px-1.5 py-0">
          v1.0
        </Badge>
      </div>
    </Link>
  );
};
