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

  // ✅ Modal untuk preview logo
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<{ url: string; name: string } | null>(
    null
  );

  const { logout } = useAuth();

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing token");

      const res = await fetch(`${SERVER_BASE_URL}/api/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Main Content */}
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
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search clients"
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
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-2 md:px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Client Name
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
                  {currentClients.length > 0 ? (
                    currentClients.map((client) => (
                      <tr key={client.id} className="hover:bg-blue-50/50">
                        <td className="px-2 md:px-6 py-3 text-sm font-medium text-gray-900">
                          {client.name}
                        </td>
                        <td className="px-2 md:px-6 py-3">
                          {client.imageUrl ? (
                            <img
                              src={client.imageUrl}
                              alt={client.name}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-sm cursor-pointer hover:opacity-80 transition"
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
                        <td className="px-2 md:px-6 py-3 text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/clients/add?edit=${client.id}`}
                              className="text-blue-500 hover:text-blue-700 p-1 md:p-2 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(client)}
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
                        No clients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Delete Modal */}
            <DeleteConfirmModal
              isOpen={showDeleteModal}
              itemName={clientToDelete?.name || ""}
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
            />

            {/* 🟦 Logo Preview Modal (Fixed Layer) */}
            {showLogoModal && selectedLogo && (
              <>
                {/* Background overlay di atas segalanya */}
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
