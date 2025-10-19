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

interface Work {
  id: number;
  description: string;
}

interface SubService {
  id: number;
  name: string;
  description: string;
  works: Work[];
}

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
  subServices: SubService[];
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
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Delete modals
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    serviceId: null as number | null,
    serviceName: "",
  });
  const [deleteSubModal, setDeleteSubModal] = useState({
    isOpen: false,
    serviceId: null as number | null,
    subServiceId: null as number | null,
    subServiceName: "",
  });
  const [deleteFeatureModal, setDeleteFeatureModal] = useState({
    isOpen: false,
    serviceId: null as number | null,
    featureId: null as number | null,
    featureName: "",
  });
  const [deleteWorkModal, setDeleteWorkModal] = useState({
    isOpen: false,
    subServiceId: null as number | null,
    workId: null as number | null,
    workName: "",
  });

  const { logout } = useAuth();

  // === Fetch services ===
  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${SERVER_BASE_URL}/api/services`, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();

      const normalized: Service[] = data.map((s: any) => ({
        id: s.id,
        name: s.name ?? "Unnamed Service",
        shortDesc: s.shortDesc || s.short_description || "",
        longDesc: s.longDesc || s.long_description || "",
        imageUrl: s.imageUrl || s.image_url || null,
        features: Array.isArray(s.features)
          ? s.features.map((f: any) => ({
              id: f.id,
              featureName: f.featureName || f.name || "Unnamed Feature",
              featureDesc: f.featureDesc || f.description || "",
            }))
          : [],
        subServices: Array.isArray(s.subServices)
          ? s.subServices.map((sub: any) => ({
              id: sub.id,
              name: sub.name ?? "Unnamed SubService",
              description: sub.description ?? "",
              works: Array.isArray(sub.works)
                ? sub.works.map((w: any) => ({
                    id: w.id,
                    description: w.description ?? "",
                  }))
                : [],
            }))
          : [],
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

  const toggleServiceExpansion = (id: number) => {
    const updated = new Set(expandedServices);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setExpandedServices(updated);
  };

  // === DELETE HANDLERS ===
  const handleDeleteService = async () => {
    if (!deleteModal.serviceId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${SERVER_BASE_URL}/api/services/${deleteModal.serviceId}`, {
        method: "DELETE",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete service");
      setServices((prev) => prev.filter((s) => s.id !== deleteModal.serviceId));
    } catch (err) {
      console.error("Error deleting service:", err);
    } finally {
      setDeleteModal({ isOpen: false, serviceId: null, serviceName: "" });
    }
  };

  const handleDeleteSubService = async () => {
    if (!deleteSubModal.serviceId || !deleteSubModal.subServiceId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${SERVER_BASE_URL}/api/services/${deleteSubModal.serviceId}/sub-services/${deleteSubModal.subServiceId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
        }
      );
      if (!res.ok) throw new Error("Failed to delete sub service");

      setServices((prev) =>
        prev.map((s) =>
          s.id === deleteSubModal.serviceId
            ? { ...s, subServices: s.subServices.filter((sub) => sub.id !== deleteSubModal.subServiceId) }
            : s
        )
      );
    } catch (err) {
      console.error("Error deleting sub service:", err);
    } finally {
      setDeleteSubModal({
        isOpen: false,
        serviceId: null,
        subServiceId: null,
        subServiceName: "",
      });
    }
  };

  const handleDeleteFeature = async () => {
    if (!deleteFeatureModal.serviceId || !deleteFeatureModal.featureId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${SERVER_BASE_URL}/api/services/${deleteFeatureModal.serviceId}/features/${deleteFeatureModal.featureId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
        }
      );
      if (!res.ok) throw new Error("Failed to delete feature");

      setServices((prev) =>
        prev.map((s) =>
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
  };

  const handleDeleteWork = async () => {
    if (!deleteWorkModal.subServiceId || !deleteWorkModal.workId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${SERVER_BASE_URL}/api/services/sub-services/${deleteWorkModal.subServiceId}/works/${deleteWorkModal.workId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
        }
      );
      if (!res.ok) throw new Error("Failed to delete work");

      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          subServices: s.subServices.map((sub) =>
            sub.id === deleteWorkModal.subServiceId
              ? { ...sub, works: sub.works.filter((w) => w.id !== deleteWorkModal.workId) }
              : sub
          ),
        }))
      );
    } catch (err) {
      console.error("Error deleting work:", err);
    } finally {
      setDeleteWorkModal({
        isOpen: false,
        subServiceId: null,
        workId: null,
        workName: "",
      });
    }
  };

  // === Pagination ===
  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.longDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredServices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage)); // pagination always visible
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredServices.slice(startIndex, endIndex);

  const handlePageClick = (page: number) => setCurrentPage(page);

  if (!user || loading)
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading services...</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <AdminHeader title="Service Management" user={user} onLogout={logout} sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

        <main className={`flex-1 pt-[72px] pb-6 px-4 md:px-6 transition-all duration-300 ${sidebarOpen ? "md:ml-72" : "md:ml-24"}`}>
          <div className="bg-gray-50/50 rounded-xl shadow-inner p-4 md:p-6">
            {/* Search + Add */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm text-gray-600"
                />
              </div>
              <Link href="/admin/services/add" className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 shadow-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </Link>
            </div>

            {/* Service List */}
            {currentItems.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No Services Found</p>
            ) : (
              <div className="grid gap-4">
                {currentItems.map((service) => (
                  <div key={service.id} className="bg-white rounded-xl shadow-md border p-5 hover:shadow-lg transition">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 items-center">
                        {service.imageUrl && <img src={safeImageUrl(service.imageUrl)} alt={service.name} className="w-20 h-20 rounded-lg object-cover border" />}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{service.shortDesc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleServiceExpansion(service.id)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                          {expandedServices.has(service.id) ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        <Link href={`/admin/services/add?edit=${service.id}`} className="p-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-50">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, serviceId: service.id, serviceName: service.name })}
                          className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded */}
                    {expandedServices.has(service.id) && (
                      <div className="mt-4 border-t pt-4 space-y-6">
                        {service.longDesc && <p className="text-gray-700 text-sm leading-relaxed">{service.longDesc}</p>}

                        {/* Sub Services */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-800">Our Services</h4>
                            <Link href={`/admin/services/${service.id}/subservice/add`} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center text-sm hover:bg-blue-200">
                              <Plus className="w-3 h-3 mr-1" /> Add Sub Service
                            </Link>
                          </div>
                          {service.subServices.length > 0 ? (
                            service.subServices.map((sub) => (
                              <div key={sub.id} className="bg-blue-50 border rounded-lg p-3 mb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-blue-800">{sub.name}</p>
                                    <p className="text-sm text-gray-700">{sub.description}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Link href={`/admin/services/${service.id}/subservice/add?edit=${sub.id}`} className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50">
                                      <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                      onClick={() =>
                                        setDeleteSubModal({
                                          isOpen: true,
                                          serviceId: service.id,
                                          subServiceId: sub.id,
                                          subServiceName: sub.name,
                                        })
                                      }
                                      className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Works */}
                                <div className="mt-3 pl-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <h6 className="font-semibold text-gray-700 text-sm">Our Work</h6>
                                    <Link href={`/admin/services/${service.id}/work/add?sub=${sub.id}`} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg flex items-center text-xs hover:bg-blue-200">
                                      <Plus className="w-3 h-3 mr-1" /> Add Work
                                    </Link>
                                  </div>
                                  {sub.works.length > 0 ? (
                                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                      {sub.works.map((w) => (
                                        <li key={w.id} className="flex justify-between items-center">
                                          <span>{w.description}</span>
                                          <div className="flex gap-2">
                                            <Link href={`/admin/services/${sub.id}/work/add?edit=${w.id}`} className="p-1 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50">
                                              <Edit className="w-3 h-3" />
                                            </Link>
                                            <button
                                              onClick={() =>
                                                setDeleteWorkModal({
                                                  isOpen: true,
                                                  subServiceId: sub.id,
                                                  workId: w.id,
                                                  workName: w.description,
                                                })
                                              }
                                              className="p-1 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-sm text-gray-500">No works available.</p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No sub services available.</p>
                          )}
                        </div>

                        {/* Features */}
                        <div>
                          <div className="flex justify-between items-center mt-6 mb-2">
                            <h4 className="font-semibold text-gray-800">Features</h4>
                            <Link href={`/admin/services/${service.id}/features/add`} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center text-sm hover:bg-blue-200">
                              <Plus className="w-3 h-3 mr-1" /> Add Feature
                            </Link>
                          </div>
                          {service.features.length > 0 ? (
                            <ul className="space-y-2">
                              {service.features.map((f) => (
                                <li key={f.id} className="flex justify-between items-start bg-gray-50 p-3 rounded-lg border hover:border-blue-300 transition">
                                  <div>
                                    <p className="font-medium text-gray-900">{f.featureName}</p>
                                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{f.featureDesc}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Link href={`/admin/services/${service.id}/features/add?edit=${f.id}`} className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50">
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
                            <p className="text-sm text-gray-500">No features available.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination (Always visible) */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 border-t pt-4 text-sm text-gray-700 gap-4">
              <div className="flex items-center gap-4">
                <p>
                  Showing{" "}
                  <span className="font-semibold">
                    {totalItems > 0 ? startIndex + 1 : 0}–{Math.min(endIndex, totalItems)}
                  </span>{" "}
                  of <span className="font-semibold">{totalItems}</span> services
                </p>
              </div>

              <div className="flex items-center gap-2">
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
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-1">per page</span>
              </label>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Modals */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.serviceName}
        onConfirm={handleDeleteService}
        onCancel={() => setDeleteModal({ isOpen: false, serviceId: null, serviceName: "" })}
      />

      <DeleteConfirmModal
        isOpen={deleteSubModal.isOpen}
        itemName={deleteSubModal.subServiceName}
        onConfirm={handleDeleteSubService}
        onCancel={() =>
          setDeleteSubModal({
            isOpen: false,
            serviceId: null,
            subServiceId: null,
            subServiceName: "",
          })
        }
      />

      <DeleteConfirmModal
        isOpen={deleteFeatureModal.isOpen}
        itemName={deleteFeatureModal.featureName}
        onConfirm={handleDeleteFeature}
        onCancel={() =>
          setDeleteFeatureModal({
            isOpen: false,
            serviceId: null,
            featureId: null,
            featureName: "",
          })
        }
      />

      <DeleteConfirmModal
        isOpen={deleteWorkModal.isOpen}
        itemName={deleteWorkModal.workName}
        onConfirm={handleDeleteWork}
        onCancel={() =>
          setDeleteWorkModal({
            isOpen: false,
            subServiceId: null,
            workId: null,
            workName: "",
          })
        }
      />
    </div>
  );
}
