"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer/Footer";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter(); // tambahkan ini
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, pathname]);

  const handleLogout = () => logout();

  if (mounted && (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))) {
    if (!user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-slate-100 flex flex-col md:flex-row">
        <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <AdminHeader
            title="Not Found"
            user={user}
            onLogout={handleLogout}
            sidebarOpen={sidebarOpen}
            onToggle={setSidebarOpen}
          />
          <main className={`flex-1 transition-all duration-500 ease-in-out ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
            <div className="pt-32 md:pt-20 p-2 md:p-6 bg-gray-50/50">
              <div className="text-center max-w-md mx-auto">
                <AlertTriangle className="w-24 h-24 mx-auto mb-6 text-blue-500" />
                <h1 className="text-8xl font-bold mb-4 text-gray-900">404</h1>
                <p className="text-2xl mb-8 text-gray-700">Page Not Found in Admin Panel</p>
                <p className="text-lg mb-8 text-gray-600">
                  The page you are looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-lg"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <svg
            className="w-32 h-32 mx-auto mb-6 text-blue-500 animate-pulse"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="20" y="50" width="60" height="30" fill="currentColor" />
            <rect x="25" y="55" width="50" height="20" fill="white" />
            <rect x="30" y="80" width="40" height="5" fill="currentColor" />
            <circle cx="40" cy="65" r="2" fill="currentColor" />
            <circle cx="60" cy="65" r="2" fill="currentColor" />
            <path d="M35 75 Q50 70 65 75" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <h1 className="text-8xl font-bold mb-4 text-gray-900">404</h1>
          <p className="text-2xl mb-8 text-gray-700">Page Not Found</p>
          <p className="text-lg mb-8 text-gray-600">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
