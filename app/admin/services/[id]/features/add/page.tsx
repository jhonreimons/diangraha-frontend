"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import SuccessModal from "@/app/components/SuccessModal";
import { SERVER_BASE_URL } from "@/lib/config";

export default function AddFeaturePage() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({ featureName: "", featureDesc: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const params = useParams();
  const searchParams = useSearchParams();

  const serviceId = params?.id as string;
  const editFeatureId = searchParams.get("edit");
  const isEditMode = !!editFeatureId;

  // 🔹 Fetch data feature saat edit
  const fetchFeatureData = async () => {
    if (!serviceId || !editFeatureId) return;
    try {
      const res = await fetch(`${SERVER_BASE_URL}/api/services/${serviceId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const service = await res.json();

      const feature = service.features?.find((f: any) => f.id === parseInt(editFeatureId));
      if (feature) {
        setFormData({
          featureName: feature.featureName ?? "",
          featureDesc: feature.featureDesc ?? "",
        });
      }
    } catch (err) {
      console.error("Error fetching feature:", err);
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

    if (isEditMode) fetchFeatureData();
  }, [isEditMode, editFeatureId, serviceId]);

  const handleLogout = () => logout();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit Add / Edit Feature
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode
        ? `${SERVER_BASE_URL}/api/services/${serviceId}/features/${editFeatureId}`
        : `${SERVER_BASE_URL}/api/services/${serviceId}/features`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setShowSuccess(true);
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} feature:`, err);
      alert(`Failed to ${isEditMode ? "update" : "add"} feature`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // redirect balik ke service detail / list
    window.location.href = `/admin/services`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <AdminHeader
        title={isEditMode ? "Edit Service Feature" : "Add Service Feature"}
        user={user}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      <main className={`pt-20 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6 bg-gray-50/50 min-h-screen flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-6">
              <Link
                href="/admin/services"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Service Management
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">
                {isEditMode ? "Edit Feature" : "Add New Feature"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature Name</label>
                  <input
                    type="text"
                    name="featureName"
                    value={formData.featureName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter feature name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Feature Description</label>
                  <textarea
                    name="featureDesc"
                    value={formData.featureDesc}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter feature description"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Link
                    href="/admin/services"
                    className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading
                      ? isEditMode
                        ? "Updating..."
                        : "Adding..."
                      : isEditMode
                      ? "Update Feature"
                      : "Add Feature"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <SuccessModal
            isOpen={showSuccess}
            message={`Feature "${formData.featureName}" ${isEditMode ? "updated" : "added"} successfully!`}
            onClose={handleSuccessClose}
          />
        </div>
      </main>
    </div>
  );
}
