"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SuccessModal from "@/app/components/SuccessModal";
import { API_BASE_URL } from "@/lib/config";

function ServiceForm({ user, sidebarOpen, handleLogout }: { 
  user: any; 
  sidebarOpen: boolean; 
  handleLogout: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  useEffect(() => {
    if (isEditMode && editId) {
      fetchServiceData(editId);
    }
  }, [isEditMode, editId]);

  const fetchServiceData = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      const services = await response.json();
      const service = services.find((s: any) => s.id === parseInt(id));

      if (service) {
        setFormData({ name: service.name, description: service.description, image: null });
        if (service.imageUrl) {
          setPreviewUrl(
            service.imageUrl.startsWith("http")
              ? service.imageUrl
              : `http://103.103.20.23:8080${service.imageUrl}`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      if (formData.image) {
        formDataToSend.append("imageFile", formData.image);
      }

      let response: Response;
      if (isEditMode && editId) {
        formDataToSend.append("id", editId);
        response = await fetch(`${API_BASE_URL}/services`, {
          method: "PUT",
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/services`, {
          method: "POST",
          body: formDataToSend,
        });
      }

      if (response.ok) {
        setShowSuccess(true);
      } else {
        console.error("Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = "/admin/services";
  };

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/admin/services"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Service Management
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditMode ? "Edit Service" : "Add New Service"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                placeholder="Enter service name"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                placeholder="Enter service description"
              />
            </div>

            {/* Service Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Service Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl hover:border-blue-400 bg-gray-50 transition-all">
                <div className="space-y-2 text-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg shadow-md border"
                    />
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <Link
                href="/admin/services"
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all"
              >
                {isEditMode ? "Update Service" : "Add Service"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        message={
          isEditMode
            ? `Service "${formData.name}" updated successfully!`
            : `Service "${formData.name}" added successfully!`
        }
        onClose={handleSuccessClose}
      />
    </div>
  );
}

export default function AddServicePage() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => logout();

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar onToggle={setSidebarOpen} />
      <main className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <AdminHeader title="Service Form" user={user} onLogout={handleLogout} />
        <Suspense fallback={<div className="p-6">Loading service form...</div>}>
          <ServiceForm user={user} sidebarOpen={sidebarOpen} handleLogout={handleLogout} />
        </Suspense>
      </main>
    </div>
  );
}
