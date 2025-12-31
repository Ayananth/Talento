export default function ConfirmModal({
  open,
  title,
  description,
  onClose,
  onConfirm,
  loading = false,
  confirmText = "Confirm",
  error = "",
  children,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-gray-600 mt-2">
            {description}
          </p>
        )}

        {/* CUSTOM CONTENT (textarea etc.) */}
        {children && <div className="mt-4">{children}</div>}

        {/* ERROR */}
        {error && (
          <p className="mt-3 text-sm text-red-600 font-medium">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded text-white
              ${
                loading
                  ? "bg-gray-400"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
          >
            {loading ? "Please wait…" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
