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
  X,
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

  // 🟦 Floating Image Preview
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);

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

  // Sidebar auto open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleServiceExpansion = (id: number) => {
    const updated = new Set(expandedServices);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setExpandedServices(updated);
  };

  // Pagination
  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.longDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalItems = filteredServices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredServices.slice(startIndex, endIndex);

  const handlePageClick = (page: number) => setCurrentPage(page);

  if (!user || loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading services...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row relative">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <AdminHeader
          title="Service Management"
          user={user}
          onLogout={logout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        {/* === MAIN CONTENT === */}
        <main
          className={`flex-1 pt-[72px] pb-6 px-4 md:px-6 transition-all duration-300 ${
            sidebarOpen ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="bg-gray-50/50 rounded-xl shadow-inner p-4 md:p-6">
            {/* Search & Add */}
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
              <Link
                href="/admin/services/add"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </Link>
            </div>

            {/* === SERVICE LIST === */}
            {currentItems.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No Services Found</p>
            ) : (
              <div className="grid gap-4">
                {currentItems.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl shadow-md border p-5 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 items-center">
                        {service.imageUrl && (
                          <img
                            src={safeImageUrl(service.imageUrl)}
                            alt={service.name}
                            className="w-20 h-20 rounded-lg object-cover border cursor-pointer hover:opacity-80"
                            onClick={() => {
                              setSelectedImage({
                                url: safeImageUrl(service.imageUrl),
                                name: service.name,
                              });
                              setShowImageModal(true);
                            }}
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{service.shortDesc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleServiceExpansion(service.id)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                          {expandedServices.has(service.id) ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        <Link
                          href={`/admin/services/add?edit=${service.id}`}
                          className="p-2 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-50"
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
                          className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {expandedServices.has(service.id) && (
                      <div className="mt-4 border-t pt-4 space-y-6">
                        {service.longDesc && (
                          <p className="text-gray-700 text-sm leading-relaxed">{service.longDesc}</p>
                        )}

                        {/* SubServices */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-800">Sub Services</h4>
                            <Link
                              href={`/admin/services/${service.id}/subservice/add`}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center text-sm hover:bg-blue-200"
                            >
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
                                </div>

                                {/* Works */}
                                <div className="mt-3 pl-4">
                                  <h6 className="font-semibold text-gray-700 text-sm mb-1">
                                    Our Work
                                  </h6>
                                  {sub.works.length > 0 ? (
                                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                      {sub.works.map((w) => (
                                        <li key={w.id}>{w.description}</li>
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
                          <h4 className="font-semibold text-gray-800 mb-2">Features</h4>
                          {service.features.length > 0 ? (
                            <ul className="space-y-2">
                              {service.features.map((f) => (
                                <li
                                  key={f.id}
                                  className="bg-gray-50 p-3 rounded-lg border hover:border-blue-300 transition"
                                >
                                  <p className="font-medium text-gray-900">{f.featureName}</p>
                                  <p className="text-xs text-gray-600 mt-1">{f.featureDesc}</p>
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

            {/* Pagination */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 border-t pt-4 text-sm text-gray-700 gap-4">
              <div>
                Showing{" "}
                <span className="font-semibold">
                  {totalItems > 0 ? startIndex + 1 : 0}–
                  {Math.min(endIndex, totalItems)}
                </span>{" "}
                of <span className="font-semibold">{totalItems}</span> services
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

      {/* === Floating Image Preview === */}
      {showImageModal && selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[1000]"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">{selectedImage.name}</h2>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-500 hover:text-red-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="w-full h-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
