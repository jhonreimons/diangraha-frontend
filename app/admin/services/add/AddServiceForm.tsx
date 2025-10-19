"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { ArrowLeft, Upload, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SERVER_BASE_URL, getImageUrl } from "@/lib/config";

export default function AddServiceForm() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    shortDesc: "",
    longDesc: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showImageError, setShowImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  const fetchServiceData = async (id: string) => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/services`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const services = await response.json();
      const service = services.find((s: any) => s.id === parseInt(id));

      if (service) {
        setFormData({
          name: service.name || "",
          shortDesc: service.shortDesc || "",
          longDesc: service.longDesc || "",
        });
        if (service.imageUrl) {
          setExistingImageUrl(getImageUrl(service.imageUrl));
        } else {
          setExistingImageUrl(null);
        }
      }
    } catch (error) {
      console.error("Error fetching service:", error);
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

    if (isEditMode && editId) {
      fetchServiceData(editId);
    }
  }, [isEditMode, editId]);

  const handleLogout = () => logout();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "shortDesc" && value.length > 255) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setExistingImageUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (isEditMode) setExistingImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditMode && !selectedImage) {
      setShowImageError(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("shortDesc", formData.shortDesc);
      formDataToSend.append("longDesc", formData.longDesc);
      if (selectedImage) formDataToSend.append("imageFile", selectedImage);
      else formDataToSend.append("imageFile", "");

      const url = isEditMode
        ? `${SERVER_BASE_URL}/api/services/${editId}`
        : `${SERVER_BASE_URL}/api/services`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = "/admin/services";
  };

  const handleImageErrorClose = () => setShowImageError(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <div className="flex-1 flex flex-col ml-0 md:ml-[260px] transition-all duration-300">
        <AdminHeader
          title={isEditMode ? "Edit Service" : "Add New Service"}
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />
        <main className="relative z-10 flex-1 bg-gray-50/50 min-h-screen pt-[100px] px-4 md:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-8 mt-4">
            <div className="mb-6">
              <Link
                href="/admin/services"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Service Management
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isEditMode ? "Edit Service" : "Add New Service"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter service name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description (max 255 characters)
                </label>
                <textarea
                  id="shortDesc"
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  maxLength={255}
                  placeholder="Brief summary displayed on service cards"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                />
                <p
                  className={`text-xs mt-1 text-right ${
                    formData.shortDesc.length > 240 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {formData.shortDesc.length}/255 characters
                </p>
              </div>

              <div>
                <label htmlFor="longDesc" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description
                </label>
                <textarea
                  id="longDesc"
                  name="longDesc"
                  value={formData.longDesc}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Detailed description for service detail page"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image{" "}
                  {!isEditMode && <span className="text-red-500 text-xs">(required)</span>}
                </label>
                <div
                  className={`relative border-2 border-dashed p-6 text-center rounded-lg hover:border-blue-400 transition-all bg-gray-50 ${
                    !isEditMode && !selectedImage ? "border-red-400" : ""
                  }`}
                >
                  {imagePreview || existingImageUrl ? (
                    <div className="relative">
                      <img
                        src={imagePreview || existingImageUrl || ""}
                        alt="Preview"
                        className="mx-auto max-h-48 rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">Click to upload service image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
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
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 disabled:opacity-50 transition-all"
                >
                  {loading
                    ? isEditMode
                      ? "Updating..."
                      : "Adding..."
                    : isEditMode
                    ? "Update Service"
                    : "Add Service"}
                </button>
              </div>
            </form>
          </div>

          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md text-center transform animate-scaleIn">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEditMode ? "Service Updated!" : "Service Added!"}
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  {isEditMode
                    ? `Service "${formData.name}" updated successfully.`
                    : `Service "${formData.name}" added successfully.`}
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

          {showImageError && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md text-center transform animate-scaleIn">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Image is required
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  Please upload an image before submitting this form.
                </p>
                <button
                  onClick={handleImageErrorClose}
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

const style = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
.animate-scaleIn {
  animation: scaleIn 0.25s ease-out;
}
`;
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = style;
  document.head.appendChild(styleEl);
}
