"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import { API_BASE_URL, SERVER_BASE_URL, safeImageUrl } from "@/lib/config";

interface Achievement {
  id: number;
  title: string;
  imageUrl: string;
}

interface User {
  name?: string;
  role?: string;
}

export default function AchievementManagementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { logout } = useAuth();

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/achievements`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      // Fallback to static data if needed
      setAchievements([]);
    } finally {
      setLoading(false);
    }
  };

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

    fetchAchievements();

    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 3 : 5);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleDeleteClick = (achievement: Achievement) => {
    setAchievementToDelete(achievement);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!achievementToDelete) return;

    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/achievements/${achievementToDelete.id}`, {
        method: "DELETE",
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        setAchievements(achievements.filter((achievement) => achievement.id !== achievementToDelete.id));
        setShowDeleteModal(false);
        setAchievementToDelete(null);
      } else {
        console.error("Failed to delete achievement");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAchievementToDelete(null);
  };

  const filteredAchievements = achievements.filter((achievement) =>
    achievement.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sortOrder === "asc") return a.title.localeCompare(b.title);
    return b.title.localeCompare(a.title);
  });

  const totalPages = Math.ceil(sortedAchievements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAchievements = sortedAchievements.slice(startIndex, endIndex);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Achievement Management</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <AdminHeader title="Achievement Management" user={user} onLogout={handleLogout} sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

        <main className={`flex-1 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
          <div className="pt-20 p-2 md:p-6 bg-gray-50/50">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center mb-4 md:mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-base md:text-2xl font-bold text-gray-900">Achievement Management</h2>
                <p className="text-xs md:text-base text-gray-600 mb-2">Manage your company achievements and awards</p>
              </div>
              <Link
                href="/admin/achievements/add"
                className="bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg shadow hover:shadow-md hover:bg-blue-700 transition-all flex items-center space-x-2 text-sm md:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Achievement</span>
              </Link>
            </div>

            {/* Search + Sort */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search achievements"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-sm text-gray-600 placeholder-gray-500 transition-all"
                  />
                </div>

                <button
                  onClick={() => { setSortOrder(sortOrder === "asc" ? "desc" : "asc"); setCurrentPage(1); }}
                  className="flex items-center space-x-2 px-3 py-1 md:px-4 md:py-2 border rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Sort ({sortOrder === "asc" ? "A-Z" : "Z-A"})</span>
                </button>
              </div>

              <div className="flex items-center space-x-1 md:space-x-2">
                <span className="text-xs md:text-sm text-gray-700">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-gray-900 bg-white"
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-xs md:text-sm text-gray-700">per page</span>
              </div>
            </div>

            {/* Achievement Cards Grid */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
                {currentAchievements.length > 0 ? (
                  currentAchievements.map((achievement) => (
                    <div key={achievement.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 group">
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={safeImageUrl(achievement.imageUrl)}
                          alt={achievement.title}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover shadow-sm mb-4"
                        />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{achievement.title}</h3>
                        <div className="flex space-x-2 mt-4">
                          <Link
                            href={`/admin/achievements/add?edit=${achievement.id}`}
                            className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(achievement)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
                    <p className="text-gray-500">Get started by adding your first achievement.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(endIndex, sortedAchievements.length)}</span> of{" "}
                    <span className="font-medium">{sortedAchievements.length}</span> results
                  </p>

                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-blue-600 text-white border-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Delete Modal */}
            <DeleteConfirmModal
              isOpen={showDeleteModal}
              itemName={achievementToDelete?.title || ""}
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
