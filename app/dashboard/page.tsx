"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import {
  BarChart3,
  FilePlus,
  Settings,
  UserCog,
  Cog,
  Building2,
  Trophy,
  Calendar,
} from "lucide-react";

interface User {
  name?: string;
  role?: string;
}

interface ContactMessage {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  companyName?: string;
  interestedIn?: string;
  message?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalServices, setTotalServices] = useState(0);
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalAchievements, setTotalAchievements] = useState(0);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [readMessages, setReadMessages] = useState<Set<number>>(new Set());
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [servicesRes, brandsRes, achievementsRes, messagesRes] = await Promise.all([
          fetch("http://103.103.20.23:8080/api/services"),
          fetch("http://103.103.20.23:8080/api/brands"),
          fetch("http://103.103.20.23:8080/api/achievements"),
          fetch("http://103.103.20.23:8080/api/contact-messages", {
            headers: {
              Accept: "*/*",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }),
        ]);

        const servicesData = servicesRes.ok ? await servicesRes.json() : [];
        const brandsData = brandsRes.ok ? await brandsRes.json() : [];
        const achievementsData = achievementsRes.ok ? await achievementsRes.json() : [];
        const messagesData = messagesRes.ok ? await messagesRes.json() : [];

        setTotalServices(Array.isArray(servicesData) ? servicesData.length : 0);
        setTotalBrands(Array.isArray(brandsData) ? brandsData.length : 0);
        setTotalAchievements(Array.isArray(achievementsData) ? achievementsData.length : 0);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recent = Array.isArray(messagesData)
          ? messagesData
              .filter((msg: ContactMessage) => new Date(msg.createdAt) >= thirtyDaysAgo)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          : [];
        setRecentMessages(recent);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => logout();

  const markAsRead = (id: number) => setReadMessages((prev) => new Set(prev).add(id));

  const toggleMessage = (id: number) => {
    setExpandedMessage((prev) => (prev === id ? null : id));
    if (!readMessages.has(id)) markAsRead(id);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Wrapper utama */}
      <div className="flex-1 flex flex-col relative transition-all duration-300">
        <AdminHeader
          title="Dashboard"
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        {/* Main content */}
        <main
          className={`flex-1 overflow-y-auto pt-[72px] pb-6 px-4 transition-all duration-300 ${
            sidebarOpen ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="p-6 bg-gray-50/50 space-y-6">
            {/* Welcome Section */}
            <div className="bg-white overflow-hidden shadow rounded-xl">
              <div className="px-6 py-3 sm:py-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Welcome back, Admin!
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  You have successfully logged in to PT Dian Graha Elektrika dashboard.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-5 border hover:shadow-md transition-all">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Cog className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Services</p>
                    <p className="text-lg font-semibold text-gray-900">{totalServices}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border hover:shadow-md transition-all">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Brands</p>
                    <p className="text-lg font-semibold text-gray-900">{totalBrands}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border hover:shadow-md transition-all">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Achievements</p>
                    <p className="text-lg font-semibold text-gray-900">{totalAchievements}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Management Sections */}
            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Management Sections</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <a
                  href="/admin/brands"
                  className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center"
                >
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Brand Management
                  </span>
                </a>

                <a
                  href="/admin/services"
                  className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center"
                >
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <FilePlus className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Service Management
                  </span>
                </a>

                <a
                  href="/admin/achievements"
                  className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center"
                >
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                    <UserCog className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-gray-900">
                      Achievement Management
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      Manage your company achievements and awards
                    </p>
                  </div>
                </a>

                <a
                  href="/admin/contacts"
                  className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center"
                >
                  <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-3">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-gray-900">
                      Contact Management
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      Manage your contact messages and inquiries
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Contact Messages (Last 30 Days)
              </h3>

              {recentMessages.length === 0 ? (
                <p className="text-gray-500 text-sm">No messages in the last 30 days.</p>
              ) : (
                <div className="space-y-3">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        readMessages.has(msg.id)
                          ? "bg-gray-50 border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                      onClick={() => toggleMessage(msg.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1">
                          <span
                            className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                              readMessages.has(msg.id)
                                ? "bg-gray-400"
                                : "bg-blue-500"
                            }`}
                          ></span>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 text-sm truncate">
                              {msg.fullName}
                            </h4>
                            <p className="text-xs text-gray-500 break-all">
                              {msg.email}
                            </p>
                            {msg.message && (
                              <p className="text-sm text-gray-700 mt-1 break-words line-clamp-2 sm:line-clamp-1">
                                {msg.message.length > 80
                                  ? `${msg.message.substring(0, 80)}...`
                                  : msg.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center text-xs text-gray-500 sm:self-start">
                          <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                          {formatDate(msg.createdAt)}
                        </div>
                      </div>

                      {expandedMessage === msg.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                          {msg.phoneNumber && (
                            <p className="text-sm text-gray-600">
                              📞 Phone: {msg.phoneNumber}
                            </p>
                          )}
                          {msg.companyName && (
                            <p className="text-sm text-gray-600">
                              🏢 Company: {msg.companyName}
                            </p>
                          )}
                          {msg.interestedIn && (
                            <p className="text-sm text-gray-600">
                              💼 Interested in: {msg.interestedIn}
                            </p>
                          )}
                          {msg.message && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-700 leading-relaxed break-words">
                                {msg.message}
                              </p>
                            </div>
                          )}
                          {!readMessages.has(msg.id) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(msg.id);
                              }}
                              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
