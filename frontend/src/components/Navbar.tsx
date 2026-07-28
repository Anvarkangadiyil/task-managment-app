import React from "react";
import { NavBrand } from "./navbar/NavBrand";
import { UserProfileMenu } from "./navbar/UserProfileMenu";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 text-zinc-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NavBrand />
        <UserProfileMenu />
      </div>
    </header>
  );
};
