import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Shield, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const UserProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initial = user.name
    ? user.name.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  const isAdmin = user.role === "admin";

  return (
    <div className="flex items-center gap-3">
      {/* User Info Badge Container */}
      <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800">
        <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
          {initial}
        </div>

        <div className="hidden md:flex flex-col text-left leading-tight">
          <span className="text-xs font-semibold text-zinc-100 line-clamp-1">
            {user.name || "User"}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {user.email}
          </span>
        </div>

        <Badge variant={isAdmin ? "admin" : "user"} className="uppercase text-[10px] px-2 py-0">
          {isAdmin ? <Shield className="w-3 h-3 mr-1" /> : <UserIcon className="w-3 h-3 mr-1" />}
          {user.role}
        </Badge>
      </div>

      {/* Logout Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800 px-3 py-1.5 h-8 gap-1.5 text-xs font-medium cursor-pointer"
        title="Sign Out"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
};
