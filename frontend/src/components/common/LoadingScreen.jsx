import React from "react";

export default function LoadingScreen({
  label = "Loading",
  fullscreen = true,
  className = "",
}) {
  const container = fullscreen ? "min-h-screen" : "";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={[
        container,
        "w-full flex items-center justify-center",
        "bg-gradient-to-b from-gray-50 to-white",
        className,
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-3 p-6">
        <div
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
        />
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
    </div>
  );
}
