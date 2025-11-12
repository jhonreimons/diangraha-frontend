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
import { SERVER_BASE_URL } from "@/lib/config";

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
  const [totalClients, setTotalClients] = useState(0);
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
        const [servicesRes, clientsRes, achievementsRes, messagesRes] = await Promise.all([
          fetch(`${SERVER_BASE_URL}/api/services`),
          fetch(`${SERVER_BASE_URL}/api/clients`),
          fetch(`${SERVER_BASE_URL}/api/achievements`),
          fetch(`${SERVER_BASE_URL}/api/contact-messages`, {
            headers: {
              Accept: "*/*",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }),
        ]);

        const servicesData = servicesRes.ok ? await servicesRes.json() : [];
        const clientsData = clientsRes.ok ? await clientsRes.json() : [];
        const achievementsData = achievementsRes.ok ? await achievementsRes.json() : [];
        const messagesData = messagesRes.ok ? await messagesRes.json() : [];

        setTotalServices(Array.isArray(servicesData) ? servicesData.length : 0);
        setTotalClients(Array.isArray(clientsData) ? clientsData.length : 0);
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
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div className="flex-1 flex flex-col relative transition-all duration-300">
        <AdminHeader
          title="Dashboard"
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />
        <main
          className={`flex-1 overflow-y-auto pt-[72px] pb-6 px-4 sm:px-6 transition-all duration-300 ${
            sidebarOpen ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-white shadow rounded-xl px-6 py-5">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Admin!</h2>
              <p className="text-gray-600 text-sm">
                You have successfully logged in to PT Dian Graha Elektrika dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Cog className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Services</p>
                    <p className="text-xl font-semibold text-gray-900">{totalServices}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-5">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Clients</p>
                    <p className="text-xl font-semibold text-gray-900">{totalClients}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-5">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Achievements</p>
                    <p className="text-xl font-semibold text-gray-900">{totalAchievements}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Management Sections</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <a
                  href="/admin/clients"
                  className="p-6 bg-white border rounded-xl text-center shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center"
                >
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Client Management</span>
                </a>

                <a
                  href="/admin/services"
                  className="p-6 bg-white border rounded-xl text-center shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center"
                >
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <FilePlus className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Service Management</span>
                </a>

                <a
                  href="/admin/achievements"
                  className="p-6 bg-white border rounded-xl text-center shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center"
                >
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                    <UserCog className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Achievement Management</span>
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    Manage your company achievements and awards
                  </p>
                </a>

                <a
                  href="/admin/contacts"
                  className="p-6 bg-white border rounded-xl text-center shadow-sm hover:shadow-md hover:scale-105 transition-all flex flex-col items-center"
                >
                  <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-3">
                    <Settings className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Contact Management</span>
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    Manage your contact messages and inquiries
                  </p>
                </a>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Contact Messages (Last 30 Days)
              </h3>
              {recentMessages.length === 0 ? (
                <p className="text-gray-500 text-sm">No messages in the last 30 days.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`w-full p-5 border rounded-xl shadow-sm cursor-pointer transition-all ${
                        readMessages.has(msg.id)
                          ? "bg-gray-50 border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                      onClick={() => toggleMessage(msg.id)}
                    >
                      <div className="flex justify-between items-start gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {msg.fullName}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">{msg.email}</p>

                          {msg.message && expandedMessage !== msg.id && (
                            <div className="mt-2 max-w-full overflow-hidden">
                              <p className="text-sm text-gray-700 text-justify overflow-hidden text-ellipsis whitespace-nowrap block">
                                {msg.message.replace(/\n/g, " ")}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center text-xs text-gray-500 whitespace-nowrap flex-shrink-0 mt-2 sm:mt-0">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(msg.createdAt)}
                        </div>
                      </div>

                      {expandedMessage === msg.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-gray-700 text-justify">
                          {msg.phoneNumber && (
                            <p className="text-sm">📞 Phone: {msg.phoneNumber}</p>
                          )}
                          {msg.companyName && (
                            <p className="text-sm">🏢 Company: {msg.companyName}</p>
                          )}
                          {msg.interestedIn && (
                            <p className="text-sm">💼 Interested in: {msg.interestedIn}</p>
                          )}
                          {msg.message && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm leading-relaxed whitespace-pre-line break-words text-justify">
                                {msg.message}
                              </p>
                            </div>
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
