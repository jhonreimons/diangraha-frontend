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

export default function AddServicePage() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const fetchServiceData = async (id: string) => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/services`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const services = await response.json();
      const service = services.find((s: any) => s.id === parseInt(id));
      if (service) {
        setFormData({ 
          name: service.name, 
          description: service.longDesc || service.shortDesc 
        });
        if (service.imageUrl) {
          const imageUrl = getImageUrl(service.imageUrl);
          console.log('Setting existing image URL:', imageUrl);
          setExistingImageUrl(imageUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching service:', error);
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

    if (isEditMode && editId) {
      fetchServiceData(editId);
    }
  }, [isEditMode, editId]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setExistingImageUrl(null); // Clear existing image when new one is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (isEditMode) {
      setExistingImageUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      if (selectedImage) {
        formDataToSend.append('imageFile', selectedImage);
      }

      const queryParams = new URLSearchParams({
        name: formData.name,
        shortDesc: formData.description,
        longDesc: formData.description,
      });

      const url = isEditMode 
        ? `${SERVER_BASE_URL}/api/services/${editId}?${queryParams}`
        : `${SERVER_BASE_URL}/api/services?${queryParams}`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setShowSuccess(true);
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} service:`, error);
      alert(`Failed to ${isEditMode ? 'update' : 'add'} service. Please try again.`);
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
          title={isEditMode ? "Edit Service" : "Add New Service"}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-gray-600 placeholder-gray-500 transition-all"
                    placeholder="Enter service name"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-gray-600 placeholder-gray-500 transition-all resize-none"
                    placeholder="Enter service description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Image
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    {(imagePreview || existingImageUrl) ? (
                      <div className="relative">
                        <img
                          src={imagePreview || existingImageUrl || ''}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded-lg shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">Click to upload service image</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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