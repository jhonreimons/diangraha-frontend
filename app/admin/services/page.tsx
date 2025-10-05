"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { Plus, Search, Edit, Trash2, ChevronDown, ChevronUp, Settings, Users, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import { SERVER_BASE_URL, getImageUrl } from "@/lib/config";

interface Service {
  id: number;
  name: string;
  shortDesc: string;
  longDesc: string;
  imageUrl: string;
  features: any[];
}

export default function ServicesPage() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedServices, setExpandedServices] = useState<Set<number>>(new Set());
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, serviceId: null as number | null, serviceName: "" });
  const [deleteFeatureModal, setDeleteFeatureModal] = useState({ isOpen: false, serviceId: null as number | null, featureId: null as number | null, featureName: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const fetchServices = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${SERVER_BASE_URL}/api/services`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Set empty array as fallback
      setServices([]);
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

    fetchServices();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const toggleServiceExpansion = (serviceId: number) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  const handleDeleteService = (serviceId: number, serviceName: string) => {
    setDeleteModal({ isOpen: true, serviceId, serviceName });
  };

  const confirmDelete = async () => {
    if (deleteModal.serviceId) {
      try {
        const response = await fetch(`${SERVER_BASE_URL}/api/services/${deleteModal.serviceId}`, {
          method: 'DELETE',
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        setServices(services.filter(service => service.id !== deleteModal.serviceId));
        setDeleteModal({ isOpen: false, serviceId: null, serviceName: "" });
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service. Please try again.');
        setDeleteModal({ isOpen: false, serviceId: null, serviceName: "" });
      }
    }
  };

  const handleDeleteFeature = (serviceId: number, featureId: number, featureName: string) => {
    setDeleteFeatureModal({ isOpen: true, serviceId, featureId, featureName });
  };

  const confirmDeleteFeature = async () => {
    if (deleteFeatureModal.serviceId && deleteFeatureModal.featureId) {
      try {
        const response = await fetch(`${SERVER_BASE_URL}/api/services/${deleteFeatureModal.serviceId}/features/${deleteFeatureModal.featureId}`, {
          method: 'DELETE',
          headers: {
            'Accept': '*/*',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        setServices(services.map(service => {
          if (service.id === deleteFeatureModal.serviceId) {
            return {
              ...service,
              features: service.features.filter(feature => feature.id !== deleteFeatureModal.featureId)
            };
          }
          return service;
        }));
        
        setDeleteFeatureModal({ isOpen: false, serviceId: null, featureId: null, featureName: "" });
      } catch (error) {
        console.error('Error deleting feature:', error);
        alert('Failed to delete feature. Please try again.');
        setDeleteFeatureModal({ isOpen: false, serviceId: null, featureId: null, featureName: "" });
      }
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.longDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Service Management</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar onToggle={setSidebarOpen} />

      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader title="Service Management" user={user} onLogout={handleLogout} sidebarOpen={sidebarOpen} />

        <div className="p-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none w-64 text-gray-600 placeholder-gray-500"
                />
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
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-gray-900 bg-white"
                >
                  <option value={2}>2</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
            </div>
            <Link
              href="/admin/services/add"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Link>
          </div>

          {/* Services Grid */}
          <div className="grid gap-6">
            {currentServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                {/* Service Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-600">{service.longDesc}</p>
                      <div className="flex items-center mt-3 text-sm text-gray-500">
                        <Settings className="w-4 h-4 mr-1" />
                        {service.features.length} Features
                      </div>
                    </div>
                    {service.imageUrl && (
                      <div className="ml-4">
                        <img
                          src={getImageUrl(service.imageUrl)}
                          alt={service.name}
                          className="w-20 h-20 rounded-lg object-cover shadow-sm"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleServiceExpansion(service.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title={expandedServices.has(service.id) ? "Collapse" : "Expand"}
                      >
                        {expandedServices.has(service.id) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      <Link
                        href={`/admin/services/add?edit=${service.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Service"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteService(service.id, service.name)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Service Features (Expandable) */}
                {expandedServices.has(service.id) && (
                  <div className="p-6 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Service Features</h4>
                      <Link
                        href={`/admin/services/${service.id}/features/add`}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all text-sm"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Feature
                      </Link>
                    </div>
                    
                    {service.features.length > 0 ? (
                      <div className="grid gap-3">
                        {service.features.map((feature) => (
                          <div
                            key={feature.id}
                            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900 mb-1">{feature.featureName || feature.feature_name}</h5>
                                <p className="text-sm text-gray-600">{feature.featureDesc || feature.feature_desc}</p>
                              </div>
                              <div className="flex items-center space-x-1 ml-4">
                                <Link
                                  href={`/admin/services/${service.id}/features/add?edit=${feature.id}`}
                                  className="p-1 text-gray-400 hover:text-blue-600 rounded transition-all"
                                  title="Edit Feature"
                                >
                                  <Edit className="w-3 h-3" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteFeature(service.id, feature.id, feature.featureName || feature.feature_name)}
                                  className="p-1 text-gray-400 hover:text-red-600 rounded transition-all"
                                  title="Delete Feature"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No features added yet</p>
                        <p className="text-sm">Click "Add Feature" to get started</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first service"}
              </p>
              <Link
                href="/admin/services/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Link>
            </div>
          )}

          {/* Pagination */}
          {filteredServices.length > 0 && totalPages > 1 && (
            <div className="bg-white rounded-xl shadow-md mt-6">
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(endIndex, filteredServices.length)}</span>{" "}
                      of <span className="font-medium">{filteredServices.length}</span> results
                    </p>
                  </div>
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
          )}
        </div>

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          itemName={deleteModal.serviceName}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({ isOpen: false, serviceId: null, serviceName: "" })}
        />
        
        <DeleteConfirmModal
          isOpen={deleteFeatureModal.isOpen}
          itemName={deleteFeatureModal.featureName}
          onConfirm={confirmDeleteFeature}
          onCancel={() => setDeleteFeatureModal({ isOpen: false, serviceId: null, featureId: null, featureName: "" })}
        />
      </main>
    </div>
  );
}