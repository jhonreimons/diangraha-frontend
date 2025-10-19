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
  Search,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import { SERVER_BASE_URL, safeImageUrl } from "@/lib/config";
import { brandsAPI } from "@/lib/api";

interface Brand {
  id: number;
  name: string;
  logoUrl?: string | null;
}

interface User {
  name?: string;
  role?: string;
}

export default function BrandManagementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<{ url: string; name: string } | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { logout } = useAuth();

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/brands`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([
        { id: 1, name: "PT Dian Graha Elektrika", logoUrl: "/uploads/brands/sample1.png" },
        { id: 2, name: "Schneider Electric", logoUrl: "/uploads/brands/sample2.png" },
        { id: 3, name: "ABB", logoUrl: null },
      ]);
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
    fetchBrands();

    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
      setItemsPerPage(window.innerWidth < 768 ? 3 : 5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => logout();

  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;
    try {
      await brandsAPI.deleteBrand(brandToDelete.id);
      setBrands(brands.filter((b) => b.id !== brandToDelete.id));
    } catch (err) {
      console.error("Error deleting brand:", err);
    } finally {
      setShowDeleteModal(false);
      setBrandToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBrandToDelete(null);
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBrands = [...filteredBrands].sort((a, b) =>
    sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const totalPages = Math.ceil(sortedBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBrands = sortedBrands.slice(startIndex, startIndex + itemsPerPage);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Brand Management</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="Brand Management"
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        {/* Main Area */}
        <main
          className={`flex-1 transition-all duration-300 mt-[80px] md:mt-[88px] px-4 md:px-6 ${
            sidebarOpen ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="bg-gray-50/50">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-base md:text-2xl font-bold text-gray-900">Brand Management</h2>
                <p className="text-xs md:text-base text-gray-600">
                  Manage your brand partners and logos
                </p>
              </div>
              <Link
                href="/admin/brands/add"
                className="bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg shadow hover:shadow-md hover:bg-blue-700 transition-all flex items-center space-x-2 text-sm md:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Brand</span>
              </Link>
            </div>

            {/* Search + Sort */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search brands"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm text-gray-600 placeholder-gray-500"
                  />
                </div>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="flex items-center space-x-2 px-3 py-1 md:px-4 md:py-2 border rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Sort ({sortOrder === "asc" ? "A-Z" : "Z-A"})</span>
                </button>
              </div>

              {/* Items per Page */}
              <div className="flex items-center space-x-2">
                <span className="text-xs md:text-sm text-gray-700">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 bg-white"
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-xs md:text-sm text-gray-700">per page</span>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Brand Name
                    </th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Logo
                    </th>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {currentBrands.length > 0 ? (
                    currentBrands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-blue-50/50">
                        <td className="px-2 md:px-6 py-3 text-sm font-medium text-gray-900">
                          {brand.name}
                        </td>
                        <td className="px-2 md:px-6 py-3">
                          <img
                            src={safeImageUrl(brand.logoUrl)}
                            alt={brand.name}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-sm cursor-pointer hover:opacity-80 transition"
                            onClick={() => {
                              setSelectedLogo({
                                url: safeImageUrl(brand.logoUrl),
                                name: brand.name,
                              });
                              setShowLogoModal(true);
                            }}
                          />
                        </td>
                        <td className="px-2 md:px-6 py-3 text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/brands/add?edit=${brand.id}`}
                              className="text-blue-500 hover:text-blue-700 p-1 md:p-2 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(brand)}
                              className="text-red-500 hover:text-red-700 p-1 md:p-2 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-2 md:px-6 py-3 text-center text-gray-500 text-sm"
                      >
                        No brands found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Delete Modal */}
            <DeleteConfirmModal
              isOpen={showDeleteModal}
              itemName={brandToDelete?.name || ""}
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
            />

            {/* ✅ Logo Preview Modal (Fixed Layer) */}
            {showLogoModal && selectedLogo && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
                  onClick={() => setShowLogoModal(false)}
                />
                {/* Modal container */}
                <div className="fixed inset-0 flex items-center justify-center z-[9999] p-6 overflow-auto">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedLogo.name} Logo
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
                        alt={selectedLogo.name}
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
