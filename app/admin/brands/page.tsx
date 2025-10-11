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
import { API_BASE_URL, SERVER_BASE_URL, safeImageUrl } from "@/lib/config";
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
      const response = await fetch(`${SERVER_BASE_URL}/api/brands`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

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

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchBrands();

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

  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;

    try {
      await brandsAPI.deleteBrand(brandToDelete.id);
      setBrands(brands.filter((brand) => brand.id !== brandToDelete.id));
      setShowDeleteModal(false);
      setBrandToDelete(null);
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBrandToDelete(null);
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBrands = [...filteredBrands].sort((a, b) => {
    if (sortOrder === "asc") return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });

  const totalPages = Math.ceil(sortedBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBrands = sortedBrands.slice(startIndex, endIndex);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Brand Management</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <AdminHeader title="Brand Management" user={user} onLogout={handleLogout} sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

        <main className={`flex-1 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
          <div className="pt-20 p-2 md:p-6 bg-gray-50/50">
          {/* Header with Add Button */}
          <div className="flex justify-between items-center mb-4 md:mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-base md:text-2xl font-bold text-gray-900">Brand Management</h2>
              <p className="text-xs md:text-base text-gray-600 mb-2">Manage your brand partners and logos</p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search brands"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-sm text-gray-600 placeholder-gray-500 transition-all"
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

          {/* Brand Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                    Brand Name
                  </th>
                  <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                    Logo
                  </th>
                  <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentBrands.length > 0 ? (
                  currentBrands.map((brand, index) => (
                    <tr key={`brand-${brand.id}-${index}`} className="hover:bg-blue-50/50">
                      <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                        <img
                          src={safeImageUrl(brand.logoUrl)}
                          alt={brand.name}
                          className="w-8 h-8 md:w-12 md:h-12 rounded-lg object-cover shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setSelectedLogo({
                              url: safeImageUrl(brand.logoUrl),
                              name: brand.name,
                            });
                            setShowLogoModal(true);
                          }}
                        />
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1 md:space-x-2">
                          <Link
                            href={`/admin/brands/add?edit=${brand.id}`}
                            className="text-blue-500 hover:text-blue-700 p-1 md:p-2 hover:bg-blue-50 rounded-lg transition-colors inline-block"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(brand)}
                            className="text-red-500 hover:text-red-700 p-1 md:p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-2 md:px-6 py-2 md:py-4 text-center text-gray-500 text-sm">
                      No brands found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(endIndex, sortedBrands.length)}</span> of{" "}
                  <span className="font-medium">{sortedBrands.length}</span> results
                </p>

                <div>
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
          </div>

          {/* Delete Modal */}
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            itemName={brandToDelete?.name || ""}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />

          {/* Logo View Modal */}
          {showLogoModal && selectedLogo && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowLogoModal(false)}
              ></div>

              <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedLogo.name} Logo
                    </h3>
                    <button
                      onClick={() => setShowLogoModal(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-6 flex justify-center">
                    <img
                      src={selectedLogo.url}
                      alt={selectedLogo.name}
                      className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
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
