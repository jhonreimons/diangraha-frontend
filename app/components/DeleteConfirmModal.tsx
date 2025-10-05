"use client";
import { useState } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ isOpen, itemName, onConfirm, onCancel }: DeleteConfirmModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => {
    setShowSuccess(true);
    onConfirm();
    
    // Hide success animation after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  if (!isOpen && !showSuccess) return null;

  return (
    <>
      {/* Delete Confirmation Modal */}
      {isOpen && !showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-lg shadow-xl border p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{itemName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white rounded-lg shadow-xl p-6 flex items-center space-x-3">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-medium">Deleted successfully!</span>
          </div>
        </div>
      )}
    </>
  );
}