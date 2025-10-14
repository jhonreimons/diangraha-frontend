"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut, User, ChevronDown, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminHeaderProps {
  title: string;
  user?: { name?: string; role?: string };
  onLogout: () => void;
  sidebarOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function AdminHeader({
  title,
  user,
  onLogout,
  sidebarOpen = true,
  onToggle,
}: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useAuth();

  // Tutup dropdown kalau klik di luar area
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    onLogout();
    setDropdownOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
        sidebarOpen ? "md:ml-72" : "md:ml-24" // ⬅️ disesuaikan dengan lebar sidebar baru
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-3 w-full overflow-visible">
        {/* === Left: Menu & Title === */}
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={() => onToggle?.(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-base md:text-xl font-semibold text-blue-700 truncate">
            {title}
          </h1>
        </div>

        {/* === Right: User Profile === */}
        <div ref={dropdownRef} className="relative flex items-center flex-shrink-0">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 md:gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* Avatar */}
            <div className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center font-semibold">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
            </div>

            {/* Info user */}
            <div className="hidden sm:flex flex-col text-left">
              <p className="font-medium text-gray-900 text-sm leading-tight">
                {user?.name || "Admin"}
              </p>
              <p className="text-gray-500 text-xs leading-tight">
                {user?.role || "Administrator"}
              </p>
            </div>

            {/* Chevron */}
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* === Dropdown Logout (posisi fix di bawah profile) === */}
          {dropdownOpen && (
            <div
              className="absolute top-[calc(100%+0.4rem)] right-0 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-[200] animate-fadeIn"
            >
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Optional animation style */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-in-out;
        }
      `}</style>
    </header>
  );
}
