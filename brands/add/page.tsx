"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { ArrowLeft, Upload, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SERVER_BASE_URL } from "@/lib/config";

interface User {
  name?: string;
  role?: string;
}

interface Brand {
  id: number;
  name: string;
  logoUrl?: string | null;
}

function BrandForm({
  user,
  sidebarOpen,
  handleLogout,
}: {
  user: User;
  sidebarOpen: boolean;
  handleLogout: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showImageError, setShowImageError] = useState(false);
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  useEffect(() => {
    if (isEditMode && editId) {
      fetchBrandData(editId);
    }
  }, [isEditMode, editId]);

  const fetchBrandData = async (id: string) => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/brands`);
      const brands: Brand[] = await response.json();
      const brand = brands.find((b) => b.id === parseInt(id));
      if (brand) {
        setFormData({ name: brand.name, image: null });
        if (brand.logoUrl) {
          setPreviewUrl(
            brand.logoUrl.startsWith("http")
              ? brand.logoUrl
              : `${SERVER_BASE_URL}${brand.logoUrl}`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching brand:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // ✅ Validasi gambar hanya untuk Add
    if (!isEditMode && !formData.image) {
      setShowImageError(true);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (formData.image) {
        formDataToSend.append("logoFile", formData.image);
      }

      const token = localStorage.getItem("token");
      const url = isEditMode
        ? `${SERVER_BASE_URL}/api/brands/${editId}`
        : `${SERVER_BASE_URL}/api/brands`;

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        console.error("Failed to save brand");
      }
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = "/admin/brands";
  };

  const handleImageErrorClose = () => setShowImageError(false);

  return (
    <div className="relative z-10 flex justify-center w-full">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 md:p-8 mt-4">
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

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? "Edit Brand" : "Add New Brand"}
        </h2>

        {/* Form */}
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
              placeholder="Enter brand name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                         text-gray-800 placeholder-gray-400 
                         focus:ring-2 focus:ring-blue-400 focus:border-transparent 
                         outline-none transition-all"
            />
          </div>

          {/* Brand Logo */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Brand Logo{" "}
              {!isEditMode && (
                <span className="text-red-500 text-xs">(required)</span>
              )}
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl 
                          hover:border-blue-400 bg-gray-50 transition-all ${
                            !isEditMode && !formData.image
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
            >
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
                <label
                  htmlFor="image"
                  className="cursor-pointer block mx-auto text-center text-sm text-gray-500 hover:text-blue-600 mt-2"
                >
                  Choose Logo File
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
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

      {/* ✅ Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md text-center transform scale-100 animate-scaleIn">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isEditMode ? "Brand Updated!" : "Brand Added!"}
            </h3>
            <p className="text-gray-600 text-sm mb-5">
              {isEditMode
                ? `Brand "${formData.name}" updated successfully.`
                : `Brand "${formData.name}" added successfully.`}
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

      {/* 🔴 Image Error Modal */}
      {showImageError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md text-center transform scale-100 animate-scaleIn">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Logo is required
            </h3>
            <p className="text-gray-600 text-sm mb-5">
              Please upload a logo image before submitting the form.
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
    </div>
  );
}

export default function AddBrandPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (userData) setUser(JSON.parse(userData) as User);
  }, []);

  const handleLogout = () => logout();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          title="Brand Form"
          user={user}
          onLogout={handleLogout}
          sidebarOpen={sidebarOpen}
          onToggle={setSidebarOpen}
        />
        <main className="relative z-10 flex-1 bg-gray-50/50 min-h-screen pt-[100px] px-4 md:px-8">
          <Suspense fallback={<div>Loading brand form...</div>}>
            <BrandForm
              user={user}
              sidebarOpen={sidebarOpen}
              handleLogout={handleLogout}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

/* ✅ Animations */
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
