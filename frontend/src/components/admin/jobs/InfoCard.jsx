function InfoCard({ label, value }) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">
        {value || "—"}
      </p>
    </div>
  );
}
