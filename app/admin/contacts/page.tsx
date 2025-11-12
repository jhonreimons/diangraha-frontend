"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import {
  Search,
  Mail,
  Phone,
  Building,
  Calendar,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import { SERVER_BASE_URL } from "@/lib/config";

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

interface User {
  name?: string;
  role?: string;
}

export default function ContactsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    messageId: null as number | null,
    messageName: "",
  });
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { logout } = useAuth();

  const fetchContactMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${SERVER_BASE_URL}/api/contact-messages`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const sortedData = Array.isArray(data)
        ? data.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : [];
      setMessages(sortedData);
    } catch {
      setMessages([]);
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
    fetchContactMessages();

    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const confirmDelete = async () => {
    if (!deleteModal.messageId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${SERVER_BASE_URL}/api/contact-messages/${deleteModal.messageId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setMessages((prev) => prev.filter((m) => m.id !== deleteModal.messageId));
    } catch {
      alert("Failed to delete message. Please try again.");
    } finally {
      setDeleteModal({ isOpen: false, messageId: null, messageName: "" });
    }
  };

  const handleDeleteMessage = (messageId: number, messageName: string) =>
    setDeleteModal({ isOpen: true, messageId, messageName });

  const handleLogout = () => logout();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredMessages = messages.filter(
    (message) =>
      message.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.interestedIn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(Math.ceil(filteredMessages.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredMessages.length);
  const currentMessages = filteredMessages.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Contact Messages
          </h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 flex flex-col md:flex-row min-h-screen text-gray-900">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <AdminHeader
          title="Contact Management"
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
          <div className="max-w-screen-2xl mx-auto bg-white rounded-2xl shadow-inner p-6 md:p-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Contact Management
                </h2>
                <p className="text-sm text-gray-600">
                  Manage your contact messages and inquiries
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm text-gray-700 placeholder-gray-500 bg-white"
                />
              </div>
            </div>

            {/* Messages */}
            <div className="grid gap-6">
              {currentMessages.length > 0 ? (
                currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {message.fullName}
                        </h3>
                        <div className="space-y-1 text-gray-600 text-sm">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" /> {message.email}
                          </div>
                          {message.phoneNumber && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" /> {message.phoneNumber}
                            </div>
                          )}
                          {message.companyName && (
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-2" /> {message.companyName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteMessage(message.id, message.fullName)
                          }
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {message.message && (
                      <div className="bg-white rounded-lg p-4 mb-3 text-gray-700 text-sm border border-gray-200 leading-relaxed">
                        {message.message.length > 150
                          ? `${message.message.substring(0, 150)}...`
                          : message.message}
                      </div>
                    )}
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(message.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <Mail className="w-14 h-14 mx-auto mb-4 text-gray-300" />
                  <p>No messages found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10 border-t pt-6 border-gray-200">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">
                  {filteredMessages.length ? startIndex + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium">{endIndex}</span> of{" "}
                <span className="font-medium">{filteredMessages.length}</span> results
              </p>

              <div className="flex items-center gap-4 flex-wrap justify-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    {[5, 10, 15, 20].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-8 h-8 rounded-md border text-sm transition ${
                      currentPage === 1
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 hover:bg-blue-100 border-gray-300"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-md border text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-8 h-8 rounded-md border text-sm transition ${
                      currentPage === totalPages
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 hover:bg-blue-100 border-gray-300"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Detail */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full sm:max-w-2xl md:max-w-3xl relative overflow-y-auto max-h-[85vh]">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
              Contact Detail
            </h3>
            <div className="space-y-5 text-gray-700 text-base leading-relaxed">
              <p><strong>Name:</strong> {selectedMessage.fullName}</p>
              <p><strong>Email:</strong> {selectedMessage.email}</p>
              {selectedMessage.phoneNumber && <p><strong>Phone:</strong> {selectedMessage.phoneNumber}</p>}
              {selectedMessage.companyName && <p><strong>Company:</strong> {selectedMessage.companyName}</p>}
              {selectedMessage.interestedIn && <p><strong>Interested In:</strong> {selectedMessage.interestedIn}</p>}
              {selectedMessage.message && (
                <div className="pt-4 border-t">
                  <p className="font-semibold mb-2">Message:</p>
                  <p className="whitespace-pre-line">{selectedMessage.message}</p>
                </div>
              )}
              <div className="flex items-center text-gray-600 text-sm pt-4 border-t">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(selectedMessage.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          itemName={deleteModal.messageName}
          onConfirm={confirmDelete}
          onCancel={() =>
            setDeleteModal({ isOpen: false, messageId: null, messageName: "" })
          }
        />
      )}
    </div>
  );
}
