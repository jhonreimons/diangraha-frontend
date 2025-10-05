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
  const [formData, setFormData] = useState({
    featureName: "",
    featureDesc: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const serviceId = params.id;
  const editFeatureId = searchParams.get('edit');
  const isEditMode = !!editFeatureId;

  const fetchFeatureData = async (featureId: string) => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/services`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const services = await response.json();
      const service = services.find((s: any) => s.id === parseInt(serviceId as string));
      if (service) {
        const feature = service.features.find((f: any) => f.id === parseInt(featureId));
        if (feature) {
          setFormData({
            featureName: feature.featureName || feature.feature_name || '',
            featureDesc: feature.featureDesc || feature.feature_desc || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching feature:', error);
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

    if (isEditMode && editFeatureId) {
      fetchFeatureData(editFeatureId);
    }
  }, [isEditMode, editFeatureId, serviceId]);

  const handleLogout = () => {
    logout();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode 
        ? `${SERVER_BASE_URL}/api/services/${serviceId}/features/${editFeatureId}`
        : `${SERVER_BASE_URL}/api/services/${serviceId}/features`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setShowSuccess(true);
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} feature:`, error);
      alert(`Failed to ${isEditMode ? 'update' : 'add'} feature. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = "/admin/services";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar onToggle={setSidebarOpen} />

      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader
          title={isEditMode ? "Edit Service Feature" : "Add Service Feature"}
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
        />

        <div className="p-6 bg-gray-50/50 min-h-screen flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="mb-6">
              <Link
                href="/admin/services"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Service Management
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isEditMode ? "Edit Feature" : "Add New Feature"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="featureName" className="block text-sm font-medium text-gray-700 mb-2">
                    Feature Name
                  </label>
                  <input
                    type="text"
                    id="featureName"
                    name="featureName"
                    value={formData.featureName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-gray-600 placeholder-gray-500 transition-all"
                    placeholder="Enter feature name"
                  />
                </div>

                <div>
                  <label htmlFor="featureDesc" className="block text-sm font-medium text-gray-700 mb-2">
                    Feature Description
                  </label>
                  <textarea
                    id="featureDesc"
                    name="featureDesc"
                    value={formData.featureDesc}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-gray-600 placeholder-gray-500 transition-all resize-none"
                    placeholder="Enter feature description"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <Link
                    href="/admin/services"
                    className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Feature" : "Add Feature")}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <SuccessModal
            isOpen={showSuccess}
            message={`Feature "${formData.featureName}" ${isEditMode ? 'updated' : 'added'} successfully!`}
            onClose={handleSuccessClose}
          />
        </div>
      </main>
    </div>
  );
}