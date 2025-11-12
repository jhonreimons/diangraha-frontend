"use client";

import { useEffect, useState, Suspense, useCallback, useRef } from "react";
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

interface Client {
  id: number;
  name: string;
  imageUrl?: string | null;
}

function resolveImageSource(imageUrl?: string | null): string {
  if (!imageUrl || imageUrl.trim() === "") return "";
  const trimmed = imageUrl.trim();
  if (trimmed.startsWith("data:image")) return trimmed;
  if (/^[A-Za-z0-9+/=]+$/.test(trimmed)) return `data:image/jpeg;base64,${trimmed}`;
  if (trimmed.startsWith("http")) return trimmed;
  return `${SERVER_BASE_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

function ClientForm({
  user,
  sidebarOpen,
  handleLogout,
}: {
  user: User;
  sidebarOpen: boolean;
  handleLogout: () => void;
}) {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  const [formData, setFormData] = useState({
    name: "",
    image: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showImageError, setShowImageError] = useState(false);

  const loadingRef = useRef(false);

  const fetchClientData = useCallback(async (id: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${SERVER_BASE_URL}/api/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const client: Client = await response.json();

      setFormData({
        name: client.name,
        image: null,
      });

      setPreviewUrl(resolveImageSource(client.imageUrl));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (isEditMode && editId) fetchClientData(editId);
  }, [isEditMode, editId, fetchClientData]);

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

    if (!isEditMode && !formData.image) {
      setShowImageError(true);
      return;
    }

    const token = localStorage.getItem("token");

    const apiUrl = isEditMode
      ? `${SERVER_BASE_URL}/api/clients/${editId}`
      : `${SERVER_BASE_URL}/api/clients`;

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    if (formData.image) formDataToSend.append("imageUrl", formData.image);

    const response = await fetch(apiUrl, {
      method: isEditMode ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formDataToSend,
    });

    if (response.ok) setShowSuccess(true);
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    window.location.href = "/admin/clients";
  };

  const closeImageErrorModal = () => setShowImageError(false);

  return (
    <div className="relative z-10 flex justify-center w-full">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 md:p-8 mt-4">
        <Link href="/admin/clients" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Client Management
        </Link>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? "Edit Client" : "Add New Client"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter client name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Logo {!isEditMode && <span className="text-red-500 text-xs">(required)</span>}
            </label>

            <div className="relative border-2 border-dashed p-6 rounded-xl bg-gray-50 text-center hover:border-blue-400 transition-all">
              {previewUrl ? (
                <img src={previewUrl} className="mx-auto max-h-40 rounded-lg shadow-sm object-cover border" />
              ) : (
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
              )}

              <label htmlFor="image" className="cursor-pointer text-sm text-gray-600 hover:text-blue-600 mt-4 block">
                {isEditMode ? "Change Logo" : "Choose Logo"}
              </label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Link href="/admin/clients" className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all">
              Cancel
            </Link>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all">
              {isEditMode ? "Update Client" : "Add Client"}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full text-center animate-scaleIn">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isEditMode ? "Client Updated!" : "Client Added!"}
            </h3>
            <button onClick={closeSuccessModal} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              OK
            </button>
          </div>
        </div>
      )}

      {showImageError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[9999] animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full text-center animate-scaleIn">
            <AlertTriangle className="w-14 h-14 text-red-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Logo is required</h3>
            <button onClick={closeImageErrorModal} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AddClientPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex md:flex-row flex-col">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col ml-0 md:ml-[260px] transition-all duration-300">
        <AdminHeader title="Client Form" user={user} onLogout={logout} sidebarOpen={sidebarOpen} />

        <main className="relative flex-1 bg-gray-50 pt-[100px] px-4 md:px-8">
          <Suspense>
            <ClientForm user={user} sidebarOpen={sidebarOpen} handleLogout={logout} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

const style = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-fadeIn { animation: fadeIn 0.25s ease-out; }
.animate-scaleIn { animation: scaleIn 0.25s ease-out; }
`;
if (typeof document !== "undefined") {
  const el = document.createElement("style");
  el.textContent = style;
  document.head.appendChild(el);
}
