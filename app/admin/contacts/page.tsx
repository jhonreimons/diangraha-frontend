"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { Search, Mail, Phone, Building, Calendar, Eye, Trash2 } from "lucide-react";
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

export default function ContactsPage() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, messageId: null as number | null, messageName: "" });
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const fetchContactMessages = async () => {
    try {
      const response = await fetch('http://103.103.20.23:8080/api/contact-messages', {
        headers: {
          'Accept': '*/*',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
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
            'Authorization': 'Basic ' + btoa('admin:diangraha-dev'),
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

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Contact Messages</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar onToggle={setSidebarOpen} />

      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader title="Contact Management" user={user} onLogout={handleLogout} />

        <div className="p-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none w-full text-gray-600 placeholder-gray-500"
              />
            </div>
          </div>

          <div className="grid gap-6">
            {filteredMessages.map((message) => (
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
                      <p className="text-gray-700 text-sm leading-relaxed">
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

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search terms" : "No contact messages received yet"}
              </p>
            </div>
          )}
        </div>

        {selectedMessage && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
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
                      <p className="text-gray-900 leading-relaxed">{selectedMessage.message}</p>
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
  );
}