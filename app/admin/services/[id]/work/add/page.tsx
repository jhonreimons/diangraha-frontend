"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { SERVER_BASE_URL } from "@/lib/config";

type WorkDetail = {
  id: number;
  description?: string;
  subService?: { id?: number; name?: string } | null;
};

export default function AddWorkPage() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({ description: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [subServiceId, setSubServiceId] = useState<string | null>(null);

  const { logout } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();

  // URL params
  const serviceId = (params?.id as string) || undefined; // hanya untuk navigasi UI
  const editWorkId = searchParams.get("edit"); // ID work
  const querySub = searchParams.get("sub"); // optional sub-service id dari URL
  const isEditMode = !!editWorkId;

  // ------- Helpers -------
  const authHeaders = () => {
    const token = localStorage.getItem("token") || "";
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  };

  // Coba resolve subServiceId dengan scan service tertentu
  const tryResolveSubFromService = async (
    svcId: string,
    workId: string
  ): Promise<string | null> => {
    try {
      const r = await fetch(`${SERVER_BASE_URL}/api/services/${svcId}`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (!r.ok) return null;
      const svc = await r.json();
      const subs = Array.isArray(svc?.subServices) ? svc.subServices : [];
      for (const sub of subs) {
        const works = Array.isArray(sub?.works) ? sub.works : [];
        if (works.some((w: any) => String(w.id) === String(workId))) {
          return String(sub.id);
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  // Fallback terakhir: scan semua services
  const tryResolveSubFromAllServices = async (
    workId: string
  ): Promise<string | null> => {
    try {
      const r = await fetch(`${SERVER_BASE_URL}/api/services`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (!r.ok) return null;
      const services = await r.json();
      for (const svc of services || []) {
        const subs = Array.isArray(svc?.subServices) ? svc.subServices : [];
        for (const sub of subs) {
          const works = Array.isArray(sub?.works) ? sub.works : [];
          if (works.some((w: any) => String(w.id) === String(workId))) {
            return String(sub.id);
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  // ------- Fetch existing Work -------
  const fetchWorkData = async () => {
    if (!editWorkId) return;
    setIsFetching(true);
    try {
      // 1) Ambil work by ID
      const res = await fetch(
        `${SERVER_BASE_URL}/api/services/sub-services/works/${editWorkId}`,
        { headers: authHeaders(), cache: "no-store" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: WorkDetail = await res.json();

      // Set description ke form
      setFormData({ description: data?.description ?? "" });

      // 2) Tentukan subServiceId
      //   a) dari response langsung
      if (data?.subService?.id) {
        setSubServiceId(String(data.subService.id));
        return;
      }

      //   b) dari query ?sub=
      if (querySub) {
        setSubServiceId(querySub);
        return;
      }

      //   c) dari scan serviceId yang ada di URL
      if (serviceId) {
        const found = await tryResolveSubFromService(serviceId, editWorkId);
        if (found) {
          setSubServiceId(found);
          return;
        }
      }

      //   d) dari scan seluruh services (fallback)
      const globalFound = await tryResolveSubFromAllServices(editWorkId);
      if (globalFound) {
        setSubServiceId(globalFound);
        return;
      }

      //   e) kalau semua gagal, beri pesan yang jelas
      alert(
        "SubService ID could not be resolved from API. Tambahkan parameter ?sub={subServiceId} pada URL untuk melanjutkan update."
      );
    } catch (err) {
      console.error("Error fetching work data:", err);
      alert("Failed to load existing work data. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  // ------- Init -------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (userData) setUser(JSON.parse(userData));

    if (isEditMode) {
      fetchWorkData();
    } else if (querySub) {
      // mode Add: kita sudah punya sub dari URL
      setSubServiceId(querySub);
    }
  }, [isEditMode, editWorkId, querySub, serviceId]);

  const handleLogout = () => logout();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ------- Submit Add / Edit -------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!subServiceId) {
        alert(
          "SubService ID not found. Tambahkan ?sub={subServiceId} pada URL atau reload halaman."
        );
        return;
      }

      const url = isEditMode
        ? `${SERVER_BASE_URL}/api/services/sub-services/${subServiceId}/works/${editWorkId}`
        : `${SERVER_BASE_URL}/api/services/sub-services/${subServiceId}/works`;

      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify({ description: formData.description }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(`HTTP ${res.status} - ${t}`);
      }

      setShowSuccess(true);
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} work:`, err);
      alert(`Failed to ${isEditMode ? "update" : "add"} Our Work`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // aman: kembali ke daftar services, bukan /admin/services/{id}
    window.location.href = `/admin/services`;
  };

  if (!user || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        {isFetching ? "Loading existing data..." : "Loading..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col ml-0 md:ml-[260px] transition-all duration-300">
        <AdminHeader
          title={isEditMode ? "Edit Our Work" : "Add Our Work"}
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        <main className="relative z-10 flex-1 bg-gray-50/50 min-h-screen pt-[100px] px-4 md:px-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-8">
            <div className="mb-6">
              <Link
                href={`/admin/services`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Service Management
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isEditMode ? "Edit Our Work" : "Add New Our Work"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Work Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  placeholder="Enter work description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                             text-gray-900 placeholder-gray-400 bg-white resize-none
                             focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Link
                  href={`/admin/services`}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 disabled:opacity-50 transition-all"
                >
                  {loading
                    ? isEditMode
                      ? "Updating..."
                      : "Adding..."
                    : isEditMode
                    ? "Update Work"
                    : "Add Work"}
                </button>
              </div>
            </form>
          </div>

          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md text-center transform animate-scaleIn">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEditMode ? "Work Updated!" : "Work Added!"}
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  Our Work {isEditMode ? "updated successfully." : "added successfully."}
                </p>
                <button
                  onClick={handleSuccessClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* === Animations === */
const style = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-fadeIn { animation: fadeIn 0.25s ease-out; }
.animate-scaleIn { animation: scaleIn 0.25s ease-out; }
`;
if (typeof document !== "undefined") {
  const el = document.createElement("style");
  el.textContent = style;
  document.head.appendChild(el);
}
