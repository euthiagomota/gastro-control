export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        {Icon ? (
          <Icon size={32} className="text-primary-600" />
        ) : (
          <div className="w-8 h-8 bg-primary-200 rounded-lg" />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
