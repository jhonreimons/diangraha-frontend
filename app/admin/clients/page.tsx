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
import { SERVER_BASE_URL } from "@/lib/config";

interface Client {
  id: number;
  name: string;
  imageUrl?: string | null;
}

interface User {
  name?: string;
  role?: string;
}

export default function ClientManagementPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [showLogoModal, setShowLogoModal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<{ url: string; name: string } | null>(null);

  const { logout } = useAuth();

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing token");

      const res = await fetch(`${SERVER_BASE_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
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
    fetchClients();

    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
      setItemsPerPage(window.innerWidth < 768 ? 3 : 5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => logout();

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing token");

      const res = await fetch(`${SERVER_BASE_URL}/api/clients/${clientToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
    } catch (err) {
      console.error("Error deleting client:", err);
      alert("Failed to delete client. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setClientToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedClients = [...filteredClients].sort((a, b) =>
    sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  const totalPages = Math.ceil(sortedClients.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentClients = sortedClients.slice(startIndex, startIndex + itemsPerPage);

  const handlePageClick = (page: number) => setCurrentPage(page);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Client Management
          </h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 flex flex-col md:flex-row min-h-screen">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="Client Management"
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        <main
          className={`flex-1 transition-all duration-300 mt-[80px] md:mt-[88px] px-4 md:px-6 ${
            sidebarOpen ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="bg-gray-50/50">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-base md:text-2xl font-bold text-gray-900">
                  Client Management
                </h2>
                <p className="text-xs md:text-base text-gray-600">
                  Manage your clients and their logos
                </p>
              </div>
              <Link
                href="/admin/clients/add"
                className="bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg shadow hover:shadow-md hover:bg-blue-700 transition-all flex items-center space-x-2 text-sm md:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Client</span>
              </Link>
            </div>

            {/* Search + Sort */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search clients"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm text-gray-600 placeholder-gray-500"
                  />
                </div>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="flex items-center space-x-2 px-3 py-2 border rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Sort ({sortOrder === "asc" ? "A-Z" : "Z-A"})</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
              <table className="min-w-full border-collapse text-sm md:text-base">
                <thead className="bg-blue-50 border-b">
                  <tr>
                    <th className="w-[50%] px-4 py-3 text-left font-semibold text-blue-700 uppercase tracking-wider">
                      Client Name
                    </th>
                    <th className="w-[30%] px-4 py-3 text-left font-semibold text-blue-700 uppercase tracking-wider">
                      Logo
                    </th>
                    <th className="w-[20%] px-4 py-3 text-center font-semibold text-blue-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentClients.length > 0 ? (
                    currentClients.map((client) => (
                      <tr key={client.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900 break-words">
                          {client.name}
                        </td>
                        <td className="px-4 py-3">
                          {client.imageUrl ? (
                            <img
                              src={client.imageUrl}
                              alt={client.name}
                              className="w-48 h-48 rounded-xl object-contain shadow-sm cursor-pointer hover:opacity-90 transition"
                              onClick={() => {
                                setSelectedLogo({
                                  url: client.imageUrl || "",
                                  name: client.name,
                                });
                                setShowLogoModal(true);
                              }}
                            />
                          ) : (
                            <span className="text-gray-400 italic text-sm">No Logo</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <Link
                              href={`/admin/clients/add?edit=${client.id}`}
                              className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(client)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg"
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
                        className="px-4 py-6 text-center text-gray-500 text-sm"
                      >
                        No clients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 border-t pt-4 text-sm text-gray-700 gap-4">
              <div>
                Showing{" "}
                <span className="font-semibold">
                  {clients.length > 0 ? startIndex + 1 : 0}–
                  {Math.min(startIndex + currentClients.length, clients.length)}
                </span>{" "}
                of <span className="font-semibold">{clients.length}</span> clients
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageClick(i + 1)}
                    className={`px-3 py-1 rounded-lg border ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-100 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <label className="flex items-center text-sm text-gray-600">
                Show
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="ml-2 px-2 py-1 border rounded-md text-gray-700 focus:ring-blue-400"
                >
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
                <span className="ml-1">per page</span>
              </label>
            </div>

            {/* Delete Modal */}
            <DeleteConfirmModal
              isOpen={showDeleteModal}
              itemName={clientToDelete?.name || ""}
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
            />

            {/* Logo Preview Modal */}
            {showLogoModal && selectedLogo && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] p-4"
                onClick={() => setShowLogoModal(false)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 flex justify-between items-center border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {selectedLogo.name}
                    </h3>
                    <button
                      onClick={() => setShowLogoModal(false)}
                      className="text-gray-500 hover:text-red-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-6 flex justify-center bg-gray-50">
                    <img
                      src={selectedLogo.url}
                      alt={selectedLogo.name}
                      className="max-w-full max-h-[80vh] object-contain rounded-md shadow-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
