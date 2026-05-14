export default function MetricCard({ label, value, trend, trendText }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{label}</h3>
      <div className="mb-2">
        <p className="text-2xl font-bold text-primary-700">{value}</p>
      </div>
      {trend && (
        <div className={`text-xs font-semibold flex items-center gap-1 ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{trend === 'up' ? '↑' : '↓'}</span>
          <span>{trendText}</span>
        </div>
      )}
    </div>
  );
}
