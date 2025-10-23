"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { SERVER_BASE_URL } from "@/lib/config";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import { Save, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AddWorkPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const { id: serviceId } = params as { id: string };
  const editId = searchParams.get("edit");
  const subServiceId = searchParams.get("subServiceId");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [workDescription, setWorkDescription] = useState("");
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { logout } = useAuth();

  // Load user dan mode edit
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) {
      router.push("/login");
      return;
    }
    if (userData) setUser(JSON.parse(userData));

    if (editId) {
      setIsEditing(true);
      fetchWorkDetail(editId);
    }
  }, [editId]);

  // Fetch detail work jika edit
  const fetchWorkDetail = async (workId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // API yang benar sesuai dengan contoh cURL kamu
      const res = await fetch(`${SERVER_BASE_URL}/api/services/sub-services/works/${workId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch work detail");

      const data = await res.json();
      setWorkDescription(data.description || "");
      setErrorMessage(null);
    } catch (err) {
      console.error("Error fetching work detail:", err);
      setErrorMessage("Failed to fetch work detail. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Add/Edit Work
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workDescription.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing
        ? `${SERVER_BASE_URL}/api/services/sub-services/${subServiceId}/works/${editId}`
        : `${SERVER_BASE_URL}/api/services/sub-services/${subServiceId}/works`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description: workDescription }),
      });

      if (!res.ok) throw new Error("Failed to save work");
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error saving work:", err);
      setErrorMessage("Failed to save work. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Sidebar auto open di desktop
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading user...
      </div>
    );

  // Modal Success
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-sm p-6 text-center transition-all duration-200">
        <div className="flex justify-center mb-3">
          <CheckCircle className="text-green-500 w-12 h-12" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {isEditing ? "Work Updated!" : "Work Added!"}
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          Work "{workDescription}" {isEditing ? "updated" : "added"} successfully.
        </p>
        <button
          onClick={() => router.push("/admin/services")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 shadow"
        >
          OK
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <AdminHeader
          title={isEditing ? "Edit Work" : "Add Work"}
          user={user}
          onLogout={logout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />

        {/* === Main Content === */}
        <main
          className={`flex-1 transition-all duration-300 mt-[80px] px-4 sm:px-6 md:px-10 py-8 ${
            sidebarOpen ? "md:ml-72" : "md:ml-24"
          }`}
        >
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 md:p-10 border">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Work" : "Add New Work"}
              </h2>
              <Link
                href="/admin/services"
                className="flex items-center text-gray-600 hover:text-blue-600 text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Link>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Work Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="Enter description of this work"
                  rows={5}
                  className="
                    w-full border border-gray-300 rounded-lg p-3 text-sm
                    text-gray-800
                    bg-white
                    focus:ring-2 focus:ring-blue-500 focus:outline-none
                    placeholder-gray-500
                    resize-none
                    selection:bg-blue-100 selection:text-gray-900
                  "
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/admin/services")}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 flex items-center transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? "Update Work" : "Save Work"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Modal Success */}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
}
