"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { ArrowLeft, Upload, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SERVER_BASE_URL } from "@/lib/config";

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

  /** Resolver untuk semua kemungkinan gambar */
  function resolveImageSource(imageUrl?: string | null): string {
    if (!imageUrl || imageUrl.trim() === "") return "";

    const trimmed = imageUrl.trim();

    if (trimmed.startsWith("data:image")) return trimmed;
    if (/^[A-Za-z0-9+/=]+$/.test(trimmed)) return `data:image/jpeg;base64,${trimmed}`;
    if (trimmed.startsWith("http")) return trimmed;

    return `${SERVER_BASE_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  }

  /** Fetch data service saat Edit */
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

        setExistingImageUrl(resolveImageSource(service.imageUrl));
      }
    } catch (err) {
      console.error("Error fetching service:", err);
    }
  };

  /** Load initial */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    if (userData) setUser(JSON.parse(userData));

    if (isEditMode && editId) fetchServiceData(editId);
  }, [isEditMode, editId]);

  const handleLogout = () => logout();

  /** Handle text input */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "shortDesc" && value.length > 255) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** Handle image input */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setExistingImageUrl(null);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (isEditMode) setExistingImageUrl(null);
  };

  /** Submit */
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

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
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

  const closeSuccess = () => {
    setShowSuccess(false);
    window.location.href = "/admin/services";
  };

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

        <main className="flex-1 bg-gray-50/50 min-h-screen pt-[100px] px-4 md:px-8">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-8 mt-4">
            <Link
              href="/admin/services"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Service Management
            </Link>

            <h2 className="text-2xl font-bold text-gray-900 my-6">
              {isEditMode ? "Edit Service" : "Add New Service"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  onChange={handleInputChange}
                  value={formData.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                />
              </div>

              {/* Short Desc */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description (max 255)
                </label>
                <textarea
                  name="shortDesc"
                  rows={3}
                  maxLength={255}
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                />
              </div>

              {/* Long Desc */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description
                </label>
                <textarea
                  name="longDesc"
                  required
                  rows={6}
                  value={formData.longDesc}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image { !isEditMode && <span className="text-red-500 text-xs">(required)</span> }
                </label>

                <div className="relative border-2 border-dashed p-6 rounded-xl bg-gray-50 text-center hover:border-blue-400 transition-all">
                  {(imagePreview || existingImageUrl) ? (
                    <div className="relative">
                      <img
                        src={imagePreview || existingImageUrl || ""}
                        className="mx-auto max-h-48 rounded-lg shadow-sm object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-gray-600 mt-2">Click to upload</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Buttons  sama seperti di Client Form) */}
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
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all disabled:opacity-50"
                >
                  {loading ? (isEditMode ? "Updating..." : "Adding...") : isEditMode ? "Update Service" : "Add Service"}
                </button>
              </div>
            </form>
          </div>

          {/* Modal Success */}
          {showSuccess && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999]">
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditMode ? "Service Updated!" : "Service Added!"}
                </h3>
                <p className="text-gray-600 text-sm mt-1 mb-5">
                  {isEditMode
                    ? `Service "${formData.name}" updated successfully.`
                    : `Service "${formData.name}" added successfully.`}
                </p>
                <button
                  onClick={closeSuccess}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {/*  Modal Image Error */}
          {showImageError && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999]">
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">Image is required</h3>
                <p className="text-gray-600 text-sm mb-5">Please upload an image before submitting.</p>
                <button
                  onClick={() => setShowImageError(false)}
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
