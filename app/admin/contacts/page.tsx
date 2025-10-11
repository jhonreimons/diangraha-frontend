"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { Search, Mail, Phone, Building, Calendar, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, messageId: null as number | null, messageName: "" });
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { logout } = useAuth();

  const fetchContactMessages = async () => {
    try {
      const response = await fetch('http://103.103.20.23:8080/api/contact-messages', {
        headers: {
          'Accept': '*/*',
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
      setMessages(sortedData);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
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

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchContactMessages();
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

  const handleDeleteMessage = (messageId: number, messageName: string) => {
    setDeleteModal({ isOpen: true, messageId, messageName });
  };

  const confirmDelete = async () => {
    if (deleteModal.messageId) {
      try {
        const response = await fetch(`http://103.103.20.23:8080/api/contact-messages/${deleteModal.messageId}`, {
          method: 'DELETE',
          headers: {
            'Accept': '*/*',
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        setMessages(messages.filter(message => message.id !== deleteModal.messageId));
        setDeleteModal({ isOpen: false, messageId: null, messageName: "" });
      } catch (error) {
        console.error('Error deleting contact message:', error);
        alert('Failed to delete message. Please try again.');
        setDeleteModal({ isOpen: false, messageId: null, messageName: "" });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(message =>
    message.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.interestedIn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = filteredMessages.slice(startIndex, endIndex);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Contact Messages</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <AdminHeader title="Contact Management" user={user} onLogout={handleLogout} sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

        <main className={`flex-1 pt-16 md:pt-0 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>

          <div className="p-2 md:p-6">
          <h2 className="text-base md:text-2xl font-bold text-gray-900 mb-2 pt-4 md:pt-0 block md:hidden">Contact Management</h2>
          <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6 block md:hidden">Manage your contact messages and inquiries</p>
          <div className="mb-4 md:mb-6 flex items-center justify-between gap-3 flex-wrap">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none w-full text-gray-600 placeholder-gray-500"
              />
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

          <div className="grid gap-6">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{message.fullName}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          <span className="text-sm">{message.email}</span>
                        </div>
                        {message.phoneNumber && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span className="text-sm">{message.phoneNumber}</span>
                          </div>
                        )}
                        {message.companyName && (
                          <div className="flex items-center text-gray-600">
                            <Building className="w-4 h-4 mr-2" />
                            <span className="text-sm">{message.companyName}</span>
                          </div>
                        )}
                        {message.interestedIn && (
                          <div className="flex items-center">
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
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message.id, message.fullName)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {message.message && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                        {message.message.length > 150
                          ? `${message.message.substring(0, 150)}...`
                          : message.message
                        }
                      </p>
                    </div>
                  )}

                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(message.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentMessages.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search terms" : "No contact messages received yet"}
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredMessages.length > itemsPerPage && (
            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(endIndex, filteredMessages.length)}</span> of{" "}
                <span className="font-medium">{filteredMessages.length}</span> results
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedMessage && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{selectedMessage.fullName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedMessage.email}</p>
                </div>
                
                {selectedMessage.phoneNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-gray-900">{selectedMessage.phoneNumber}</p>
                  </div>
                )}
                
                {selectedMessage.companyName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <p className="text-gray-900">{selectedMessage.companyName}</p>
                  </div>
                )}
                
                {selectedMessage.interestedIn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interested In</label>
                    <p className="text-gray-900">{selectedMessage.interestedIn}</p>
                  </div>
                )}
                
                {selectedMessage.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage.message}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Received At</label>
                  <p className="text-gray-900">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          itemName={`message from ${deleteModal.messageName}`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ isOpen: false, messageId: null, messageName: "" })}
        />
      </main>
    </div>
  </div>
  );
}
