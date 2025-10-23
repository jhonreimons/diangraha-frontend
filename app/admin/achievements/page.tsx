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
import { SERVER_BASE_URL, safeImageUrl } from "@/lib/config";

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
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Logo preview
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<{ url: string; title: string } | null>(null);

  const { logout } = useAuth();

  // Fetch achievements
  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/achievements`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
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

    if (userData) setUser(JSON.parse(userData));
    fetchAchievements();

    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
      setItemsPerPage(window.innerWidth < 768 ? 3 : 6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => logout();

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
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        setAchievements((prev) => prev.filter((a) => a.id !== achievementToDelete.id));
        setShowDeleteModal(false);
        setAchievementToDelete(null);
      } else {
        console.error("Failed to delete achievement");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
    }
  };

  const filteredAchievements = achievements.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAchievements = [...filteredAchievements].sort((a, b) =>
    sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  );

  const totalPages = Math.ceil(sortedAchievements.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAchievements = sortedAchievements.slice(startIndex, startIndex + itemsPerPage);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Achievement Management
          </h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 flex flex-col md:flex-row min-h-screen">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col transition-all duration-300">
        <AdminHeader
          title="Achievement Management"
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 mt-[80px] md:mt-[90px] px-4 sm:px-6 md:px-10 py-8 ${
            sidebarOpen ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="max-w-screen-2xl mx-auto bg-gray-50/50 rounded-2xl shadow-inner p-6 md:p-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                  Achievement Management
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  Manage your company achievements and awards
                </p>
              </div>
              <Link
                href="/admin/achievements/add"
                className="bg-blue-600 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-lg shadow hover:shadow-md hover:bg-blue-700 transition-all flex items-center space-x-2 text-sm md:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Achievement</span>
              </Link>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search achievements"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm text-gray-700 placeholder-gray-500"
                  />
                </div>

                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Sort ({sortOrder === "asc" ? "A-Z" : "Z-A"})</span>
                </button>
              </div>

              {/* Items per page */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 bg-white"
                >
                  <option value={3}>3</option>
                  <option value={6}>6</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
            </div>

            {/* Achievement Grid */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 p-6 md:p-8">
                {currentAchievements.length > 0 ? (
                  currentAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 text-center group"
                    >
                      {/* Logo Image */}
                      <div className="bg-white p-3 rounded-lg flex justify-center items-center h-36 mb-4 shadow-inner">
                        <img
                          src={safeImageUrl(achievement.imageUrl)}
                          alt={achievement.title}
                          onClick={() => {
                            setSelectedLogo({
                              url: safeImageUrl(achievement.imageUrl),
                              title: achievement.title,
                            });
                            setShowLogoModal(true);
                          }}
                          className="max-h-32 w-auto object-contain mx-auto cursor-pointer hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2">
                        {achievement.title}
                      </h3>
                      <div className="flex justify-center space-x-2 mt-4">
                        <Link
                          href={`/admin/achievements/add?edit=${achievement.id}`}
                          className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(achievement)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No achievements found
                    </h3>
                    <p className="text-gray-500">
                      Get started by adding your first achievement.
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
                <p className="text-sm text-gray-700 mb-2 sm:mb-0">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + currentAchievements.length, sortedAchievements.length)}
                  </span>{" "}
                  of <span className="font-medium">{sortedAchievements.length}</span> results
                </p>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md border text-sm font-medium ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Delete Modal */}
            <DeleteConfirmModal
              isOpen={showDeleteModal}
              itemName={achievementToDelete?.title || ""}
              onConfirm={handleDeleteConfirm}
              onCancel={() => setShowDeleteModal(false)}
            />

            {/* Logo Preview Modal */}
            {showLogoModal && selectedLogo && (
              <>
                <div
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
                  onClick={() => setShowLogoModal(false)}
                />
                <div className="fixed inset-0 flex items-center justify-center z-[9999] p-6 overflow-auto">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedLogo.title}
                      </h3>
                      <button
                        onClick={() => setShowLogoModal(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                      >
                        ×
                      </button>
                    </div>
                    <div className="p-6 flex justify-center bg-gray-50">
                      <img
                        src={selectedLogo.url}
                        alt={selectedLogo.title}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
