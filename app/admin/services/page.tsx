"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
import { SERVER_BASE_URL, safeImageUrl } from "@/lib/config";

interface Feature {
  id: number;
  featureName: string;
  featureDesc: string;
}

interface Service {
  id: number;
  name: string;
  shortDesc: string;
  longDesc: string;
  imageUrl: string | null;
  features: Feature[];
}

interface User {
  name?: string;
  role?: string;
}

export default function ServicesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedServices, setExpandedServices] = useState<Set<number>>(new Set());
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    serviceId: null as number | null,
    serviceName: "",
  });
  const [deleteFeatureModal, setDeleteFeatureModal] = useState({
    isOpen: false,
    serviceId: null as number | null,
    featureId: null as number | null,
    featureName: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const fetchServices = async () => {
    try {
      const res = await fetch(`${SERVER_BASE_URL}/api/services`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Service[] = await res.json();

      const normalized = data.map((s) => ({
        ...s,
        features: Array.isArray(s.features) ? s.features : [],
      }));

      setServices(normalized);
    } catch (err) {
      console.error("Error fetching services:", err);
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

    if (userData) setUser(JSON.parse(userData));

    fetchServices();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
      setItemsPerPage(window.innerWidth < 768 ? 3 : 5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleServiceExpansion = (serviceId: number) => {
    const newExpanded = new Set(expandedServices);
    newExpanded.has(serviceId)
      ? newExpanded.delete(serviceId)
      : newExpanded.add(serviceId);
    setExpandedServices(newExpanded);
  };

  const confirmDelete = async () => {
    if (deleteModal.serviceId) {
      try {
        const res = await fetch(`${SERVER_BASE_URL}/api/services/${deleteModal.serviceId}`, {
          method: "DELETE",
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        if (!res.ok) throw new Error("Failed to delete");
        setServices(services.filter((s) => s.id !== deleteModal.serviceId));
      } catch (err) {
        console.error("Error deleting service:", err);
      } finally {
        setDeleteModal({ isOpen: false, serviceId: null, serviceName: "" });
      }
    }
  };

  const confirmDeleteFeature = async () => {
    if (deleteFeatureModal.serviceId && deleteFeatureModal.featureId) {
      try {
        const res = await fetch(
          `${SERVER_BASE_URL}/api/services/${deleteFeatureModal.serviceId}/features/${deleteFeatureModal.featureId}`,
          {
            method: "DELETE",
            headers: { Authorization: "Bearer " + localStorage.getItem("token") },
          }
        );
        if (!res.ok) throw new Error("Failed to delete feature");

        setServices(
          services.map((s) =>
            s.id === deleteFeatureModal.serviceId
              ? { ...s, features: s.features.filter((f) => f.id !== deleteFeatureModal.featureId) }
              : s
          )
        );
      } catch (err) {
        console.error("Error deleting feature:", err);
      } finally {
        setDeleteFeatureModal({
          isOpen: false,
          serviceId: null,
          featureId: null,
          featureName: "",
        });
      }
    }
  };

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.longDesc?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Konten utama */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        <AdminHeader
          title="Service Management"
          user={user}
          onLogout={logout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        {/* ✅ Offset header dan sidebar */}
        <main
          className={`flex-1 pt-[72px] pb-6 px-4 md:px-6 transition-all duration-300 ${
            sidebarOpen ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="bg-gray-50/50 rounded-xl shadow-inner p-4 md:p-6">
            <h2 className="text-base md:text-2xl font-bold text-gray-900 mb-2">
              Service Management
            </h2>
            <p className="text-xs md:text-base text-gray-600 mb-6">
              Manage your services and features
            </p>

            {/* Header: Search + Add */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search services"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm text-gray-600 placeholder-gray-500 transition-all"
                />
              </div>
              <Link
                href="/admin/services/add"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </Link>
            </div>

            {/* Service Cards */}
            <div className="grid gap-4">
              {currentServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-md border p-4 md:p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <p
                        className="text-xs md:text-sm text-gray-600 mt-1"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {service.shortDesc || service.longDesc || "No description available"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {service.imageUrl && (
                        <img
                          src={safeImageUrl(service.imageUrl)}
                          alt={service.name}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover border"
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleServiceExpansion(service.id)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          {expandedServices.has(service.id) ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        <Link
                          href={`/admin/services/add?edit=${service.id}`}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              serviceId: service.id,
                              serviceName: service.name,
                            })
                          }
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedServices.has(service.id) && (
                    <div className="mt-4 border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-800">Features</h4>
                        <Link
                          href={`/admin/services/${service.id}/features/add`}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center text-sm hover:bg-blue-200"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Add Feature
                        </Link>
                      </div>
                      {service.features?.length > 0 ? (
                        <ul className="space-y-2">
                          {service.features.map((f) => (
                            <li
                              key={f.id}
                              className="flex justify-between items-start bg-gray-50 p-2 md:p-4 rounded-lg border hover:border-blue-300 transition"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {f.featureName}
                                </p>
                                <p
                                  className="text-xs md:text-sm text-gray-600"
                                  style={{ whiteSpace: "pre-wrap" }}
                                >
                                  {f.featureDesc}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Link
                                  href={`/admin/services/${service.id}/features/add?edit=${f.id}`}
                                  className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() =>
                                    setDeleteFeatureModal({
                                      isOpen: true,
                                      serviceId: service.id,
                                      featureId: f.id,
                                      featureName: f.featureName,
                                    })
                                  }
                                  className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs md:text-sm text-gray-500">
                          No features available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              {filteredServices.length > 0 ? (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>
                    Showing <span className="font-medium">{startIndex + 1}</span> –{" "}
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPerPage, filteredServices.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredServices.length}</span> results
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded-lg px-2 py-1 text-sm"
                  >
                    <option value={3}>3 per page</option>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                  </select>
                </div>
              ) : (
                <span className="text-sm text-gray-500">No results found</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 flex items-center bg-white hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-gray-50"
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
                  className="px-3 py-1 border rounded disabled:opacity-50 flex items-center bg-white hover:bg-gray-50"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Delete Modals */}
          <DeleteConfirmModal
            isOpen={deleteModal.isOpen}
            itemName={deleteModal.serviceName}
            onConfirm={confirmDelete}
            onCancel={() =>
              setDeleteModal({ isOpen: false, serviceId: null, serviceName: "" })
            }
          />
          <DeleteConfirmModal
            isOpen={deleteFeatureModal.isOpen}
            itemName={deleteFeatureModal.featureName}
            onConfirm={confirmDeleteFeature}
            onCancel={() =>
              setDeleteFeatureModal({
                isOpen: false,
                serviceId: null,
                featureId: null,
                featureName: "",
              })
            }
          />
        </main>
      </div>
    </div>
  );
}
