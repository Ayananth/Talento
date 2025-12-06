import React from "react";
import { X, AlertTriangle } from "lucide-react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">

        <button className="absolute right-4 top-4 text-gray-500" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle size={24} className="text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">Delete Experience</h2>
        </div>

        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this experience? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
