import { useEffect } from "react";

export default function Toast({
  message,
  type = "success", // success | error
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`px-4 py-3 rounded-lg shadow-lg text-sm text-white
          ${
            type === "success"
              ? "bg-green-600"
              : "bg-red-600"
          }
        `}
      >
        {message}
      </div>
    </div>
  );
}
