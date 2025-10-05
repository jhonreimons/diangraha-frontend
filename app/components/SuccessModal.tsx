"use client";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, message, onClose }: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-green-500 text-white rounded-lg shadow-xl p-6 flex items-center space-x-3">
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}