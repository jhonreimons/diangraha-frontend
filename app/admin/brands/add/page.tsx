"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SuccessModal from "@/app/components/SuccessModal";
import { API_BASE_URL } from "@/lib/config";

export default function AddBrandPage() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    logo: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { logout } = useAuth();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

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
      fetchBrandData(editId);
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const fetchBrandData = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands`);
      const brands = await response.json();
      const brand = brands.find((b: any) => b.id === parseInt(id));
      
      if (brand) {
        setFormData({ name: brand.name, logo: null });
        if (brand.logoUrl) {
          setPreviewUrl(brand.logoUrl.startsWith('http') ? brand.logoUrl : `http://103.103.20.23:8080${brand.logoUrl}`);
        }
      }
    } catch (error) {
      console.error('Error fetching brand:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (formData.logo) {
        formDataToSend.append('logoFile', formData.logo);
      }
      
      if (isEditMode && editId) {
        formDataToSend.append('id', editId);
        const response = await fetch(`${API_BASE_URL}/brands`, {
          method: 'PUT',
          body: formDataToSend,
        });
        
        if (response.ok) {
          setShowSuccess(true);
        } else {
          console.error('Failed to update brand');
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/brands`, {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          setShowSuccess(true);
        } else {
          console.error('Failed to create brand');
        }
      }
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = "/admin/brands";
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

      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <AdminHeader
          title={isEditMode ? "Edit Brand" : "Add New Brand"}
          user={user}
          onLogout={handleLogout}
        />

        <div className="p-6 bg-gray-50/50 min-h-screen flex justify-center">
          <div className="w-full max-w-2xl">
            {/* Back button */}
            <div className="mb-6">
              <Link
                href="/admin/brands"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Brand Management
              </Link>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isEditMode ? "Edit Brand" : "Add New Brand"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Brand Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Brand Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none text-gray-600 placeholder-gray-500 transition-all"
                    placeholder="Enter brand name"
                  />
                </div>

                {/* Brand Logo Upload */}
                <div>
                  <label
                    htmlFor="logo"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Brand Logo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl hover:border-blue-400 bg-gray-50 transition-all">
                    <div className="space-y-2 text-center">
                      {previewUrl ? (
                        <div className="mb-4">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg shadow-md border"
                          />
                        </div>
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="logo"
                          className="relative cursor-pointer font-medium text-blue-600 hover:text-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="logo"
                            name="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6">
                  <Link
                    href="/admin/brands"
                    className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all"
                  >
                    {isEditMode ? "Update Brand" : "Add Brand"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <SuccessModal
            isOpen={showSuccess}
            message={isEditMode ? `Brand "${formData.name}" updated successfully!` : `Brand "${formData.name}" added successfully!`}
            onClose={handleSuccessClose}
          />
        </div>
      </main>
    </div>
  );
}
