"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";

export default function NotFound() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    // 🔧 ubah dari bg-gray-50 → bg-white dan tambahkan text-gray-900 agar kontras
    <div className="flex h-screen bg-white text-gray-900">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div
        className={`flex-1 flex flex-col ${
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        } bg-white`}
      >
        <AdminHeader
          title="Brand Management"
          user={{ name: "Admin", role: "Administrator" }}
          onLogout={() => {}}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        {/* 🔧 Pastikan main section juga putih */}
        <main className="flex-1 flex items-center justify-center p-6 bg-amber-500">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-24 h-24 mx-auto mb-6 text-yellow-500" />
            <h1 className="text-8xl font-bold mb-4 text-gray-900">404</h1>
            <p className="text-2xl mb-8 text-gray-700">
              Page Not Found in Admin Panel
            </p>
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
        </main>
      </div>
    </div>
  );
}
