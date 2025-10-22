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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";

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
    try {
      const response = await fetch("http://103.103.20.23:8080/api/contact-messages", {
        headers: {
          Accept: "*/*",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const sortedData = Array.isArray(data)
        ? data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : [];
      setMessages(sortedData);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
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

    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
      setItemsPerPage(window.innerWidth < 768 ? 3 : 5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => logout();

  const handleDeleteMessage = (messageId: number, messageName: string) =>
    setDeleteModal({ isOpen: true, messageId, messageName });

  const confirmDelete = async () => {
    if (!deleteModal.messageId) return;
    try {
      const response = await fetch(
        `http://103.103.20.23:8080/api/contact-messages/${deleteModal.messageId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setMessages((prev) => prev.filter((m) => m.id !== deleteModal.messageId));
    } catch (error) {
      console.error("Error deleting contact message:", error);
      alert("Failed to delete message. Please try again.");
    } finally {
      setDeleteModal({ isOpen: false, messageId: null, messageName: "" });
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = filteredMessages.slice(startIndex, endIndex);

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
    <div className="bg-slate-100 flex flex-col md:flex-row min-h-screen relative">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div className="flex-1 flex flex-col transition-all duration-300 z-0">
        <AdminHeader
          title="Contact Management"
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        <main
          className={`flex-1 mt-[80px] md:mt-[90px] transition-all duration-300 px-4 sm:px-6 md:px-10 py-8 ${
            sidebarOpen ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="max-w-screen-2xl mx-auto bg-gray-50/50 rounded-2xl shadow-inner p-6 md:p-10 relative z-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                  Contact Management
                </h2>
                <p className="text-sm md:text-base text-gray-600">
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm text-gray-700 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Messages */}
            <div className="grid gap-6">
              {currentMessages.length > 0 ? (
                currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {message.fullName}
                        </h3>
                        <div className="space-y-1 text-gray-600 text-sm">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {message.email}
                          </div>
                          {message.phoneNumber && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {message.phoneNumber}
                            </div>
                          )}
                          {message.companyName && (
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-2" />
                              {message.companyName}
                            </div>
                          )}
                          {message.interestedIn && (
                            <div className="mt-1">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Interested in: {message.interestedIn}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteMessage(message.id, message.fullName)
                          }
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {message.message && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-3 text-gray-700 text-sm leading-relaxed">
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
                <div className="text-center py-16">
                  <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No messages found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "No contact messages received yet"}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, filteredMessages.length || 1)}
                </span>{" "}
                of <span className="font-medium">{filteredMessages.length || 1}</span> results
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Fixed Centered Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4 sm:px-0">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-[90%] sm:w-full sm:max-w-[600px] mx-auto animate-fadeIn relative"
            style={{ animation: "fadeIn 0.25s ease-out" }}
          >
            <div className="sticky top-0 px-5 py-4 sm:px-6 sm:py-5 border-b border-gray-200 flex items-center justify-between bg-white z-10 rounded-t-2xl">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Message Details
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            <div className="px-5 sm:px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <p className="text-gray-900">{selectedMessage.fullName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{selectedMessage.email}</p>
              </div>

              {selectedMessage.phoneNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900">{selectedMessage.phoneNumber}</p>
                </div>
              )}

              {selectedMessage.companyName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <p className="text-gray-900">{selectedMessage.companyName}</p>
                </div>
              )}

              {selectedMessage.interestedIn && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interested In
                  </label>
                  <p className="text-gray-900">{selectedMessage.interestedIn}</p>
                </div>
              )}

              {selectedMessage.message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p
                      className="text-gray-900 leading-relaxed"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received At
                </label>
                <p className="text-gray-900">
                  {formatDate(selectedMessage.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        itemName={`message from ${deleteModal.messageName}`}
        onConfirm={confirmDelete}
        onCancel={() =>
          setDeleteModal({ isOpen: false, messageId: null, messageName: "" })
        }
      />
    </div>
  );
}
