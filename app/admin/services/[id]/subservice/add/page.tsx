"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { SERVER_BASE_URL } from "@/lib/config";

export default function AddSubServicePage() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const params = useParams();
  const searchParams = useSearchParams();

  const serviceId = params?.id as string; // service id dari URL
  const editSubServiceId = searchParams.get("edit"); // id sub-service (mode edit)
  const isEditMode = !!editSubServiceId;

  // === Fetch existing sub-service by ID ===
  const fetchSubServiceData = async () => {
    if (!editSubServiceId) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing token");

      const res = await fetch(
        `${SERVER_BASE_URL}/api/services/sub-services/${editSubServiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Set data dari API ke form
      setFormData({
        name: data.name ?? "",
        description: data.description ?? "",
      });
    } catch (err) {
      console.error("Error fetching sub-service:", err);
      alert("Failed to load existing sub-service data.");
    }
  };

  // === Initialize on load ===
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (userData) setUser(JSON.parse(userData));
    if (isEditMode) fetchSubServiceData();
  }, [isEditMode, editSubServiceId]);

  const handleLogout = () => logout();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // === Submit Add / Edit Sub-Service ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing token");

      const url = isEditMode
        ? `${SERVER_BASE_URL}/api/services/${serviceId}/sub-services/${editSubServiceId}`
        : `${SERVER_BASE_URL}/api/services/${serviceId}/sub-services`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setShowSuccess(true);
    } catch (err) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} sub-service:`,
        err
      );
      alert(`Failed to ${isEditMode ? "update" : "add"} sub-service.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = `/admin/services`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-[260px] transition-all duration-300">
        <AdminHeader
          title={isEditMode ? "Edit Sub Service" : "Add Sub Service"}
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        <main className="relative z-10 flex-1 bg-gray-50/50 min-h-screen pt-[100px] px-4 md:px-8">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-8">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                href={`/admin/services`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Service Management
              </Link>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isEditMode ? "Edit Sub Service" : "Add New Sub Service"}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sub Service Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter sub service name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                             text-gray-900 placeholder-gray-400 bg-white
                             focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  placeholder="Enter sub service description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                             text-gray-900 placeholder-gray-400 bg-white resize-none
                             focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Link
                  href="/admin/services"
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
                    ? "Update Sub Service"
                    : "Add Sub Service"}
                </button>
              </div>
            </form>
          </div>

          {/* Success Modal */}
          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md text-center transform animate-scaleIn">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEditMode ? "Sub Service Updated!" : "Sub Service Added!"}
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  Sub Service "{formData.name}"{" "}
                  {isEditMode ? "updated successfully." : "added successfully."}
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
