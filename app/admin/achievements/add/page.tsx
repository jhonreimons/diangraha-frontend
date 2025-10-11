"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminHeader from "@/app/components/AdminHeader";
import { ArrowLeft, Upload, Trophy } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SuccessModal from "@/app/components/SuccessModal";
import { API_BASE_URL, SERVER_BASE_URL, safeImageUrl } from "@/lib/config";

interface User {
  name?: string;
  role?: string;
}

interface Achievement {
  id: number;
  title: string;
  imageUrl: string;
}

function AchievementForm({ user, sidebarOpen, handleLogout }: {
  user: User;
  sidebarOpen: boolean;
  handleLogout: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  useEffect(() => {
    if (isEditMode && editId) {
      fetchAchievementData(editId);
    }
  }, [isEditMode, editId]);

  const fetchAchievementData = async (id: string) => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}/api/achievements`);
      const achievements: Achievement[] = await response.json();
      const achievement = achievements.find((a) => a.id === parseInt(id));

      if (achievement) {
        setFormData({ title: achievement.title, image: null });
        setPreviewUrl(safeImageUrl(achievement.imageUrl));
      }
    } catch (error) {
      console.error("Error fetching achievement:", error);
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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      if (formData.image) {
        formDataToSend.append("imageFile", formData.image);
      }

      let response: Response;
      if (isEditMode && editId) {
        response = await fetch(`${SERVER_BASE_URL}/api/achievements/${editId}`, {
          method: "PUT",
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
          },
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${SERVER_BASE_URL}/api/achievements`, {
          method: "POST",
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token"),
          },
          body: formDataToSend,
        });
      }

      if (response.ok) {
        setShowSuccess(true);
      } else {
        console.error("Failed to save achievement");
      }
    } catch (error) {
      console.error("Error saving achievement:", error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    window.location.href = "/admin/achievements";
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl p-6">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/admin/achievements"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Achievement Management
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
            {isEditMode ? "Edit Achievement" : "Add New Achievement"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Achievement Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Achievement Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
                placeholder="Enter achievement title"
              />
            </div>

            {/* Achievement Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Achievement Image
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
                  <label htmlFor="image" className="cursor-pointer block mx-auto text-center text-sm text-gray-500 hover:text-blue-600 mt-2">
                    Choose Achievement Image
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
                href="/admin/achievements"
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all"
              >
                {isEditMode ? "Update Achievement" : "Add Achievement"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        message={
          isEditMode
            ? `Achievement "${formData.title}" updated successfully!`
            : `Achievement "${formData.title}" added successfully!`
        }
        onClose={handleSuccessClose}
      />
    </div>
  );
}

export default function AddAchievementPage() {
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <AdminHeader title="Achievement Form" user={user} onLogout={handleLogout} sidebarOpen={sidebarOpen} onToggle={setSidebarOpen} />

        <main className="flex-1">
          <div className="pt-20 md:pt-0 p-2 md:p-6 bg-gray-50/50 min-h-screen">
            <Suspense fallback={<div>Loading achievement form...</div>}>
              <AchievementForm user={user} sidebarOpen={sidebarOpen} handleLogout={handleLogout} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
