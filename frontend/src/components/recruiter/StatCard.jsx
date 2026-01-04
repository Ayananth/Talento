export const StatCard = ({ label, value, Icon }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between">
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <Icon className="w-8 h-8 text-blue-500" />
  </div>
);