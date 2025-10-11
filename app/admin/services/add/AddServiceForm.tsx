"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SuccessModal from "@/app/components/SuccessModal";
import { SERVER_BASE_URL, getImageUrl } from "@/lib/config";

export default function AddServiceForm() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  // 🔹 Ambil data lama untuk mode edit
  const fetchServiceData = async (id: string) => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/services`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const services = await response.json();
      const service = services.find((s: any) => s.id === parseInt(id));

      if (service) {
        setFormData({
          name: service.name || "",
          description: service.longDesc || "",
        });
        if (service.imageUrl) {
          setExistingImageUrl(getImageUrl(service.imageUrl));
        }
      }
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  };

  // 🔹 Auth check dan fetch data edit
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
  setLoading(true);

  try {
    let response;

    if (isEditMode) {
      // URL sesuai API backend kamu
      const url = `${SERVER_BASE_URL}/api/services/${editId}?name=${encodeURIComponent(
        formData.name
      )}&shortDesc=${encodeURIComponent(formData.description)}&longDesc=${encodeURIComponent(formData.description)}`;

      // Selalu kirim FormData, meski tanpa gambar
      const formDataToSend = new FormData();

      // hanya tambahkan file jika ada gambar baru
      if (selectedImage) {
        formDataToSend.append("imageFile", selectedImage);
      }

      response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          // ❌ jangan set Content-Type manual biarkan browser generate boundary otomatis
        },
        body: formDataToSend,
      });
    } else {
      // Mode tambah baru (POST)
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("shortDesc", formData.description);
      formDataToSend.append("longDesc", formData.description);
      if (selectedImage) formDataToSend.append("imageFile", selectedImage);

      response = await fetch(`${SERVER_BASE_URL}/api/services`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formDataToSend,
      });
    }

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

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />
      <AdminHeader
        title={isEditMode ? "Edit Service" : "Add New Service"}
        user={user}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      <main className={`pt-20 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        <div className="p-4 md:p-6 bg-gray-50/50 min-h-screen flex justify-center">
          <div className="w-full">
            <div className="mb-6">
              <Link href="/admin/services" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Service Management
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isEditMode ? "Edit Service" : "Add New Service"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Name */}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
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
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="Detailed description for service pages"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Image</label>
                  <div className="relative border-2 border-dashed p-6 text-center rounded-lg">
                    {(imagePreview || existingImageUrl) ? (
                      <div className="relative">
                        <img
                          src={imagePreview || existingImageUrl || ""}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded-lg"
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

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6">
                  <Link href="/admin/services" className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {loading ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Service" : "Add Service")}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <SuccessModal
            isOpen={showSuccess}
            message={isEditMode ? `Service "${formData.name}" updated successfully!` : `Service "${formData.name}" added successfully!`}
            onClose={handleSuccessClose}
          />
        </div>
      </main>
    </div>
  );
}
