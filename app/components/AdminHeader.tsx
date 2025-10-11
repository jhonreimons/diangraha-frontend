"use client";

import { useState, useEffect } from "react";
import { LogOut, User, ChevronDown, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminHeaderProps {
  title: string;
  user?: {
    name?: string;
    role?: string;
  };
  onLogout: () => void;
  sidebarOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function AdminHeader({ title, user, onLogout, sidebarOpen = true, onToggle }: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    onLogout();
    setDropdownOpen(false);
  };

  return (
    <header className="fixed md:sticky top-0 z-50 transition-all duration-300 w-screen">
      <div className={`bg-white/80 backdrop-blur-md shadow-sm border-b flex items-center justify-between pl-2 pr-4 md:pl-4 md:pr-6 py-3 ${sidebarOpen ? 'md:ml-60' : 'md:ml-16'}`}>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onToggle?.(!sidebarOpen)}
            className="-ml-10 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base md:text-xl font-semibold text-blue-700">{title}</h1>
        </div>

        <div className="flex items-center space-x-1 md:space-x-4">
          {/* User info */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 md:space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors max-w-48"
            >
              <div className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
              </div>
              <div className="text-xs md:text-sm min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{user?.name || "Admin"}</p>
                <p className="text-gray-500 text-xs md:block hidden truncate">{user?.role || "Administrator"}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
