"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { BarChart3, Users, Clock, FilePlus, Settings, UserCog } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar onToggle={setSidebarOpen} />
      
      <main className={`transition-all duration-300 ${
        sidebarOpen ? "ml-64" : "ml-20"
      }`}>
        <AdminHeader title="Dashboard" user={user} onLogout={handleLogout} />
        <div className="p-6 bg-gray-50/50 min-h-screen space-y-6">
        {/* Welcome */}
        <div className="bg-white overflow-hidden shadow rounded-xl">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Admin!</h2>
            <p className="text-gray-600">
              You have successfully logged in to PT Dian Graha Elektrika dashboard.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Projects</p>
                <p className="text-lg font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Clients</p>
                <p className="text-lg font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Tasks</p>
                <p className="text-lg font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <button className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-900">View Reports</span>
            </button>

            <button className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                <FilePlus className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-900">Add Project</span>
            </button>

            <button className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                <UserCog className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-900">Manage Users</span>
            </button>

            <button className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-3">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-900">Settings</span>
            </button>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
