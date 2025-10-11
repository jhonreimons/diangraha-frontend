"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Cog, Phone, Trophy, Home } from "lucide-react";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export default function AdminSidebar({ sidebarOpen, onToggle }: AdminSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pathname = usePathname();

  const handleToggle = () => {
    onToggle(!sidebarOpen);
  };

  const sidebarWidth = sidebarOpen ? "250px" : "0px";

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { href: "/admin/brands", label: "Brand Management", icon: <Building2 className="w-5 h-5" /> },
    { href: "/admin/services", label: "Service Management", icon: <Cog className="w-5 h-5" /> },
    { href: "/admin/achievements", label: "Achievement Management", icon: <Trophy className="w-5 h-5" /> },
    { href: "/admin/contacts", label: "Contact Management", icon: <Phone className="w-5 h-5" /> },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-700 via-blue-600 to-blue-500 text-white shadow-xl transition-all duration-500 ease-in-out z-60 ${sidebarOpen ? 'w-64' : isMobile ? 'hidden' : 'w-20'}`}
      >
        {/* Logo & Toggle */}
        <div className="p-4 border-b border-blue-400/20">
          {sidebarOpen ? (
            <>
              <div className="flex flex-col items-center">
                <div className="bg-white text-blue-700 rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-sm text-xs">
                  DGE
                </div>
                <h2 className="mt-2 text-sm font-semibold tracking-wide">Admin Panel</h2>
              </div>
              {isMobile && (
                <button
                  onClick={() => onToggle(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-blue-600/40 rounded-lg transition-colors"
                >
                  <span className="text-white text-xl font-bold">×</span>
                </button>
              )}
            </>
          ) : null}
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
                sidebarOpen ? "px-4" : "px-6"
              }`}
              title={!sidebarOpen ? item.label : ""}
            >
              <span>{item.icon}</span>
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>




    </>
  );
}
