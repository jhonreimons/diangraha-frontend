"use client";

import { LogOut, User } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  user?: {
    name?: string;
    role?: string;
  };
  onLogout: () => void;
  sidebarOpen?: boolean;
}

export default function AdminHeader({ title, user, onLogout, sidebarOpen = true }: AdminHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b">
      <div className="flex justify-between items-center px-6 py-3">
        <h1 className={`text-xl font-semibold text-blue-700 transition-all duration-300 ${!sidebarOpen ? 'ml-16' : ''}`}>{title}</h1>

        <div className="flex items-center space-x-4">
          {/* User info */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user?.name || "Admin"}</p>
              <p className="text-gray-500 text-xs">{user?.role || "Administrator"}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-medium shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
