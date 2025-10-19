"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Cog, Phone, Trophy, Home, Handshake, X } from "lucide-react";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export default function AdminSidebar({ sidebarOpen, onToggle }: AdminSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    // { href: "/admin/brands", label: "Brand Management", icon: <Building2 className="w-5 h-5" /> },
    { href: "/admin/services", label: "Service Management", icon: <Cog className="w-5 h-5" /> },
    { href: "/admin/clients", label: "Client Management", icon: <Handshake className="w-5 h-5" /> },
    { href: "/admin/achievements", label: "Achievement Management", icon: <Trophy className="w-5 h-5" /> },
    { href: "/admin/contacts", label: "Contact Management", icon: <Phone className="w-5 h-5" /> },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[190] md:hidden"
          onClick={() => onToggle(false)}
        />
      )}

      <aside
        className={`${
          isMobile
            ? `
              fixed top-0 left-0 h-screen w-64 
              bg-gradient-to-b from-blue-700 via-blue-600 to-blue-500 
              text-white z-[200] shadow-lg 
              transform transition-transform duration-300 ease-in-out 
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `
            : `
              fixed top-0 left-0 h-screen 
              bg-gradient-to-b from-blue-700 via-blue-600 to-blue-500 
              text-white shadow-lg z-[100] 
              transition-all duration-300 ease-in-out 
              ${sidebarOpen ? "w-72" : "w-24"}
            `
        }`}
      >
        {/* ===================== DESKTOP SIDEBAR ===================== */}
        {!isMobile && (
          <div className="flex flex-col h-full">
            {/* Header */}
            {sidebarOpen ? (
              <div className="p-4 border-b border-blue-400/20 flex items-center gap-3">
                <div className="bg-white text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                  DGE
                </div>
                <h2 className="text-[11px] font-semibold tracking-wide">Admin Panel</h2>
              </div>
            ) : (
              <div className="p-4 flex justify-center border-b border-blue-400/20">
                <div className="bg-white text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm shadow-sm">
                  DGE
                </div>
              </div>
            )}

            {/* Menu — naik ke bawah logo saat collapsed */}
            <div
              className={`flex-1 flex flex-col ${
                sidebarOpen ? "justify-start mt-4" : "justify-start mt-2"
              } overflow-y-auto px-2`}
            >
              <nav
                className={`flex flex-col gap-2 ${
                  !sidebarOpen ? "items-center" : ""
                }`}
              >
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center py-2 rounded-md transition-colors duration-150 ${
                      isActive(item.href)
                        ? "bg-white/20 text-white"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    } ${sidebarOpen ? "pl-3 pr-2" : "justify-center w-full"}`}
                  >
                    <span
                      className={`flex items-center justify-center w-6 min-w-6 ${
                        sidebarOpen ? "mr-3" : ""
                      }`}
                    >
                      {item.icon}
                    </span>

                    {sidebarOpen && (
                      <span className="truncate text-sm leading-none tracking-wide">
                        {item.label}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-4 text-[10px] text-blue-200 text-center border-t border-blue-400/20">
              © 2025 DGE Admin
            </div>
          </div>
        )}

        {/* ===================== MOBILE SIDEBAR ===================== */}
        {isMobile && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-blue-400/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                  DGE
                </div>
                <h2 className="text-[11px] font-semibold tracking-wide">Admin Panel</h2>
              </div>
              <button
                onClick={() => onToggle(false)}
                className="p-1.5 hover:bg-blue-600/40 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="mt-4 flex flex-col gap-2 px-2 overflow-y-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onToggle(false)}
                  className={`flex items-center py-2 rounded-md transition-colors duration-150 ${
                    isActive(item.href)
                      ? "bg-white/20 text-white"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  } pl-4 pr-3`}
                >
                  <span className="flex items-center justify-center w-6 min-w-6 mr-3">
                    {item.icon}
                  </span>
                  <span className="truncate text-xs leading-tight font-medium">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto p-4 text-[10px] text-blue-200 text-center border-t border-blue-400/20">
              © 2025 DGE Admin
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
