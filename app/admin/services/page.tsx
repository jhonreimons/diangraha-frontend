"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import DeleteConfirmModal from "@/app/components/DeleteConfirmModal";
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
import { SERVER_BASE_URL } from "@/lib/config";

/* ========= Types ========= */
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
  createdAt?: string | null;
  features: Feature[];
  subServices: SubService[];
}
interface User {
  name?: string;
  role?: string;
}

/* ========= Helpers ========= */
const resolveBase64Image = (src?: string | null) => {
  if (!src) return "/placeholder.png";
  const v = src.trim();
  if (v.startsWith("data:image")) return v;
  if (/^[A-Za-z0-9+/=]+$/.test(v)) return `data:image/jpeg;base64,${v}`;
  return v;
};

/* ========= Page ========= */
export default function ServicesPage() {
  const { logout } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<{ url: string; name: string } | null>(null);

  const [deleteService, setDeleteService] = useState({ open: false, id: null as number | null, name: "" });
  const [deleteSub, setDeleteSub] = useState({ open: false, serviceId: null as number | null, subId: null as number | null, name: "" });
  const [deleteWork, setDeleteWork] = useState({ open: false, subId: null as number | null, workId: null as number | null, name: "" });

  const [deleteFeature, setDeleteFeature] = useState({
    open: false,
    serviceId: null as number | null,
    featureId: null as number | null,
    name: "",
  });

  /* ========= FETCH ========= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }

    const userInfo = localStorage.getItem("user");
    if (userInfo) setUser(JSON.parse(userInfo));

    void fetchServices();

    const adjustSidebar = () => setSidebarOpen(window.innerWidth >= 1024);
    adjustSidebar();
    window.addEventListener("resize", adjustSidebar);
    return () => window.removeEventListener("resize", adjustSidebar);
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";

      const res = await fetch(`${SERVER_BASE_URL}/api/services`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "*/*" },
        cache: "no-store",
      });

      const data = await res.json();

      const normalized: Service[] = (Array.isArray(data) ? data : []).map((s: any): Service => ({
        id: s.id,
        name: s.name,
        shortDesc: s.shortDesc || "",
        longDesc: s.longDesc || "",
        imageUrl: s.imageBase64 || s.imageUrl || null,
        createdAt: s.createdAt,
        features: s.features || [],
        subServices: s.subServices || [],
      }));
      normalized.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
      setServices(normalized);
    } finally {
      setLoading(false);
    }
  };

  /* ========= SEARCH & PAGINATION ========= */
  const filtered = useMemo(
    () =>
      services.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.longDesc.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [services, searchTerm]
  );

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  /* ========= DELETE ACTIONS ========= */
  const doDeleteService = async () => {
    if (!deleteService.id) return;
    const token = localStorage.getItem("token") || "";

    await fetch(`${SERVER_BASE_URL}/api/services/${deleteService.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setServices((prev) => prev.filter((s) => s.id !== deleteService.id));
    setDeleteService({ open: false, id: null, name: "" });
  };

  const doDeleteSubService = async () => {
    if (!deleteSub.subId || !deleteSub.serviceId) return;
    const token = localStorage.getItem("token") || "";

    await fetch(`${SERVER_BASE_URL}/api/services/${deleteSub.serviceId}/sub-services/${deleteSub.subId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setServices((prev) =>
      prev.map((svc) =>
        svc.id !== deleteSub.serviceId
          ? svc
          : { ...svc, subServices: svc.subServices.filter((s) => s.id !== deleteSub.subId) }
      )
    );

    setDeleteSub({ open: false, subId: null, serviceId: null, name: "" });
  };

  const doDeleteWork = async () => {
    if (!deleteWork.subId || !deleteWork.workId) return;
    const token = localStorage.getItem("token") || "";

    await fetch(`${SERVER_BASE_URL}/api/services/sub-services/${deleteWork.subId}/works/${deleteWork.workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setServices((prev) =>
      prev.map((svc) => ({
        ...svc,
        subServices: svc.subServices.map((s) =>
          s.id !== deleteWork.subId ? s : { ...s, works: s.works.filter((w) => w.id !== deleteWork.workId) }
        ),
      }))
    );

    setDeleteWork({ open: false, subId: null, workId: null, name: "" });
  };

  const doDeleteFeature = async () => {
    if (!deleteFeature.serviceId || !deleteFeature.featureId) return;
    const token = localStorage.getItem("token") || "";

    await fetch(
      `${SERVER_BASE_URL}/api/services/${deleteFeature.serviceId}/features/${deleteFeature.featureId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setServices((prev) =>
      prev.map((svc) =>
        svc.id !== deleteFeature.serviceId
          ? svc
          : { ...svc, features: svc.features.filter((f) => f.id !== deleteFeature.featureId) }
      )
    );

    setDeleteFeature({ open: false, serviceId: null, featureId: null, name: "" });
  };

  /* ========= LOADING ========= */
  if (!user || loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Services Management
          </h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  /* ========= RENDER ========= */
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-gray-900 dark:text-gray-900">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="Service Management"
          user={user}
          onLogout={logout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        <main
          className={`flex-1 pt-[72px] pb-6 px-4 md:px-6 transition-all duration-300 ${
            sidebarOpen ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">

            {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h2 className="text-xl md:text-3xl font-bold">Services Management</h2>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-lg px-3 py-2 shadow-sm flex-1 w-full"
            />

            <Link
              href="/admin/services/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </Link>
          </div>
        </div>


            {/* LIST CARD */}
            {currentItems.map((svc) => (
              <div key={svc.id} className="bg-white p-5 rounded-xl border shadow mb-4">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full">
                    {svc.imageUrl && (
                      <img
                        src={resolveBase64Image(svc.imageUrl)}
                        loading="lazy"
                        className="w-20 h-20 rounded-xl border shadow cursor-pointer object-contain"
                        onClick={() => {
                          setImagePreview({ url: resolveBase64Image(svc.imageUrl), name: svc.name });
                          setShowImageModal(true);
                        }}
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{svc.name}</h3>
                      <p className="text-gray-600 text-sm">{svc.shortDesc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">

                    {/* ✅ FIXED TOGGLE (EXPAND/COLLAPSE) */}
                    <button
                      onClick={() => {
                        setExpanded((prev) => {
                          const newSet = new Set(prev);
                          if (newSet.has(svc.id)) newSet.delete(svc.id);
                          else newSet.add(svc.id);
                          return newSet;
                        });
                      }}
                      className="hover:bg-gray-100 rounded-lg p-1 transition"
                    >
                      {expanded.has(svc.id) ? (
                        <ChevronUp className="w-6 h-6" />
                      ) : (
                        <ChevronDown className="w-6 h-6" />
                      )}
                    </button>

                    <Link href={`/admin/services/add?edit=${svc.id}`}>
                      <Edit className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                    </Link>

                    <Trash2
                      className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-700"
                      onClick={() =>
                        setDeleteService({ open: true, id: svc.id, name: svc.name })
                      }
                    />
                  </div>
                </div>

                {/* DETAIL EXPANDED */}
                {expanded.has(svc.id) && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-gray-700 mb-4">{svc.longDesc}</p>

                    {/* SUB SERVICES */}
                    <div className="mt-6">
                      <div className="flex justify-between mb-3">
                        <h4 className="text-lg font-bold">Sub Services</h4>

                        <Link
                          href={`/admin/services/${svc.id}/subservice/add`}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg"
                        >
                          <Plus className="w-4 h-4" /> Add Sub Service
                        </Link>
                      </div>

                      {svc.subServices.map((sub) => (
                        <div key={sub.id} className="bg-blue-50 p-4 rounded-lg border mb-3">
                          <div className="flex justify-between">
                            <div>
                              <h5 className="font-semibold">{sub.name}</h5>
                              <p className="text-sm text-gray-600">{sub.description}</p>
                            </div>

                            <div className="flex gap-2">
                              <Link href={`/admin/services/${svc.id}/subservice/add?edit=${sub.id}`}>
                                <Edit className="w-5 h-5 text-blue-600" />
                              </Link>

                              <Trash2
                                className="w-5 h-5 text-red-600 cursor-pointer"
                                onClick={() =>
                                  setDeleteSub({ open: true, subId: sub.id, serviceId: svc.id, name: sub.name })
                                }
                              />
                            </div>
                          </div>

                          {/* WORKS */}
                          <div className="mt-3 ml-4">
                            <div className="flex justify-between">
                              <h6 className="font-semibold text-sm">Our Work</h6>

                              <Link
                                href={`/admin/services/${svc.id}/work/add?subServiceId=${sub.id}`}
                                className="flex items-center gap-2 px-2 py-1 bg-green-100 text-green-700 rounded-lg"
                              >
                                <Plus className="w-4 h-4" /> Add Work
                              </Link>
                            </div>

                            {sub.works.map((w) => (
                              <div key={w.id} className="flex justify-between mt-1 p-2 ">
                                <span className="text-sm">{w.description}</span>
                                <div className="flex gap-2">
                                  <Link
                                    href={`/admin/services/${svc.id}/work/add?subServiceId=${sub.id}&edit=${w.id}`}
                                  >
                                    <Edit className="w-4 h-4 text-blue-600" />
                                  </Link>

                                  <Trash2
                                    className="w-4 h-4 text-red-600 cursor-pointer"
                                    onClick={() =>
                                      setDeleteWork({ open: true, subId: sub.id, workId: w.id, name: w.description })
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* FEATURES */}
                    <div className="mt-6">
                      <div className="flex justify-between mb-3">
                        <h4 className="text-lg font-bold">Features</h4>

                        <Link
                          href={`/admin/services/${svc.id}/features/add`}
                          className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg"
                        >
                          <Plus className="w-4 h-4" /> Add Feature
                        </Link>
                      </div>

                      {svc.features.map((f) => (
                        <div key={f.id} className="bg-gray-50 p-4 rounded-lg border mb-3 flex justify-between">
                          <div>
                            <p className="font-semibold">{f.featureName}</p>
                            <p className="text-sm text-gray-600">{f.featureDesc}</p>
                          </div>

                          <div className="flex gap-3">
                            <Link href={`/admin/services/${svc.id}/features/add?edit=${f.id}`}>
                              <Edit className="w-5 h-5 text-blue-600" />
                            </Link>

                            <Trash2
                              className="w-5 h-5 text-red-600 cursor-pointer"
                              onClick={() =>
                                setDeleteFeature({
                                  open: true,
                                  serviceId: svc.id,
                                  featureId: f.id,
                                  name: f.featureName,
                                })
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <div>
                Showing <b>{startIndex + 1}</b> -{" "}
                <b>{Math.min(startIndex + currentItems.length, totalItems)}</b> of <b>{totalItems}</b>
              </div>

              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  <ChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg border ${
                      currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                  <ChevronRight />
                </button>
              </div>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
          </div>
        </main>
      </div>

      {/* IMAGE MODAL */}
      {showImageModal && imagePreview && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-xl max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold">{imagePreview.name}</h2>
              <X className="cursor-pointer" onClick={() => setShowImageModal(false)} />
            </div>

            <img src={imagePreview.url} className="max-h-[80vh] object-contain w-full" />
          </div>
        </div>
      )}

      {/* DELETE MODALS */}
      <DeleteConfirmModal
        isOpen={deleteService.open}
        itemName={deleteService.name}
        onCancel={() => setDeleteService({ open: false, id: null, name: "" })}
        onConfirm={doDeleteService}
      />

      <DeleteConfirmModal
        isOpen={deleteSub.open}
        itemName={deleteSub.name}
        onCancel={() => setDeleteSub({ open: false, subId: null, serviceId: null, name: "" })}
        onConfirm={doDeleteSubService}
      />

      <DeleteConfirmModal
        isOpen={deleteWork.open}
        itemName={deleteWork.name}
        onCancel={() => setDeleteWork({ open: false, subId: null, workId: null, name: "" })}
        onConfirm={doDeleteWork}
      />

      <DeleteConfirmModal
        isOpen={deleteFeature.open}
        itemName={deleteFeature.name}
        onCancel={() =>
          setDeleteFeature({ open: false, featureId: null, serviceId: null, name: "" })
        }
        onConfirm={doDeleteFeature}
      />
    </div>
  );
}
