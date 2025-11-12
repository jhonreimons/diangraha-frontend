"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import { SERVER_BASE_URL } from "@/lib/config";

interface Achievement {
  id: number;
  title: string;
  imageUrl?: string | null;
  createdAt: string;
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
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(
    null
  );
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(
    null
  );
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [userSetItems, setUserSetItems] = useState(false);

  const { logout } = useAuth();

  const fetchAchievements = async () => {
    try {
      const res = await fetch(`${SERVER_BASE_URL}/api/achievements`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const sorted = [...data].sort(
        (a: Achievement, b: Achievement) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setAchievements(sorted);
    } catch (e) {
      console.error("Error fetching achievements:", e);
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
      if (!userSetItems) setItemsPerPage(window.innerWidth < 768 ? 3 : 6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userSetItems]);

  const handleLogout = () => logout();

  const handleDeleteClick = (achievement: Achievement) => {
    setAchievementToDelete(achievement);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!achievementToDelete) return;

    await fetch(`${SERVER_BASE_URL}/api/achievements/${achievementToDelete.id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });

    setAchievements((prev) => prev.filter((a) => a.id !== achievementToDelete.id));
    setShowDeleteModal(false);
  };

  const filtered = achievements.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(Math.ceil(filtered.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const currentAchievements = filtered.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setUserSetItems(true);
    setCurrentPage(1);
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
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
    <div className="bg-slate-100 flex flex-col md:flex-row min-h-screen text-gray-900">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="Achievement Management"
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        <main
          className={`flex-1 mt-[80px] md:mt-[90px] px-4 sm:px-6 md:px-10 py-8 ${
            sidebarOpen ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="max-w-screen-xl mx-auto pb-8">
            {/* HEADER + ADD BUTTON */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                Achievement Management
              </h2>

              <Link
                href="/admin/achievements/add"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Achievement</span>
              </Link>
            </div>

            {/* SEARCH INPUT */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-72 shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>

            {/* LIST */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {currentAchievements.length > 0 ? (
                  currentAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-white rounded-xl shadow p-6 text-center"
                    >
                      <div className="bg-white p-3 rounded-lg flex justify-center items-center h-36 mb-4 shadow-inner">
                        <img
                          src={achievement.imageUrl || "/placeholder.png"}
                          alt={achievement.title}
                          onClick={() => {
                            setSelectedImage({
                              url: achievement.imageUrl || "/placeholder.png",
                              title: achievement.title,
                            });
                            setShowImageModal(true);
                          }}
                          className="max-h-32 object-contain mx-auto cursor-pointer hover:scale-105 transition"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {achievement.title}
                      </h3>

                      <div className="flex justify-center space-x-2 mt-4">
                        <Link
                          href={`/admin/achievements/add?edit=${achievement.id}`}
                          className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(achievement)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      No achievements found
                    </h3>
                  </div>
                )}
              </div>

              {/* PAGINATION */}
              <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t border-gray-200 gap-3">
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {filtered.length ? startIndex + 1 : 0}
                  </span>{" "}
                  to <span className="font-medium">{endIndex}</span> of{" "}
                  <span className="font-medium">{filtered.length}</span> results
                </p>

                <div className="flex flex-wrap items-center gap-4 justify-center">
                  {/* ITEMS PER PAGE SELECT */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Show:</label>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                      {[3, 6, 9, 12, 15].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PAGINATION BUTTONS */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-2 border rounded-lg transition ${
                        currentPage === 1
                          ? "text-gray-400 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-300 hover:bg-blue-50"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-md border text-sm font-medium transition ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(currentPage + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`p-2 border rounded-lg transition ${
                        currentPage === totalPages
                          ? "text-gray-400 border-gray-200 cursor-not-allowed"
                          : "text-gray-700 border-gray-300 hover:bg-blue-50"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* DELETE MODAL */}
            <DeleteConfirmModal
              isOpen={showDeleteModal}
              itemName={achievementToDelete?.title || ""}
              onConfirm={handleDeleteConfirm}
              onCancel={() => setShowDeleteModal(false)}
            />

            {/* IMAGE MODAL */}
            {showImageModal && selectedImage && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
                onClick={() => setShowImageModal(false)}
              >
                <div
                  className="bg-white p-4 rounded-xl max-w-3xl w-full mx-4 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">{selectedImage.title}</h2>
                    <button
                      onClick={() => setShowImageModal(false)}
                      className="text-gray-500 hover:text-red-600 text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  <img
                    src={selectedImage.url}
                    className="w-full max-h-[80vh] object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
