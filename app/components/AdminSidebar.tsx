"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Cog, Phone } from "lucide-react";

interface AdminSidebarProps {
  onToggle: (isOpen: boolean) => void;
}

export default function AdminSidebar({ onToggle }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle(newState);
  };

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/admin/brands", label: "Brand Management", icon: <Building2 className="w-5 h-5" /> },
    { href: "/admin/services", label: "Service Management", icon: <Cog className="w-5 h-5" /> },
    { href: "/admin/contacts", label: "Contact Management", icon: <Phone className="w-5 h-5" /> },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Sidebar */}
      <div
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-blue-700 via-blue-600 to-blue-500 text-white shadow-xl transition-all duration-300 z-40"
        style={{ width: isOpen ? "250px" : "80px" }}
      >
        {/* Logo & Toggle */}
        <div className="p-4 border-b border-blue-400/20">
          {isOpen ? (
            <>
              <div className="flex flex-col items-center">
                <div className="bg-white text-blue-700 rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-sm text-xs">
                  DGE
                </div>
                <h2 className="mt-2 text-sm font-semibold tracking-wide">Admin Panel</h2>
              </div>
              <button
                onClick={handleToggle}
                className="absolute top-4 right-4 p-2 hover:bg-blue-600/40 rounded-lg transition-colors"
              >
                <div className="flex flex-col space-y-1">
                  <div className="w-5 h-0.5 bg-white"></div>
                  <div className="w-5 h-0.5 bg-white"></div>
                  <div className="w-5 h-0.5 bg-white"></div>
                </div>
              </button>
            </>
          ) : (
            <div className="flex justify-center">
              <div className="bg-white text-blue-700 rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-sm text-xs">
                DGE
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center py-3 text-sm font-medium rounded-md mx-2 ${
                isActive(item.href)
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              } ${
                isOpen ? "px-4" : "px-6"
              }`}
              title={!isOpen ? item.label : ""}
            >
              <span>{item.icon}</span>
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* External toggle button when collapsed */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          className="fixed top-4 z-50 p-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-all duration-300"
          style={{ left: '96px' }}
        >
          <div className="flex flex-col space-y-1">
            <div className="w-5 h-0.5 bg-black"></div>
            <div className="w-5 h-0.5 bg-black"></div>
            <div className="w-5 h-0.5 bg-black"></div>
          </div>
        </button>
      )}

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
