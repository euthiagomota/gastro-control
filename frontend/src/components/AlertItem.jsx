export default function AlertItem({ type, message }) {
  const typeStyles = {
    error: 'bg-red-50 border-l-4 border-red-500',
    warning: 'bg-yellow-50 border-l-4 border-yellow-400',
    info: 'bg-blue-50 border-l-4 border-blue-500',
  };

  const iconStyles = {
    error: 'text-red-500',
    warning: 'text-yellow-600',
    info: 'text-blue-500',
  };

  const typeIcons = {
    error: '⊕',
    warning: '⚠',
    info: 'ⓘ',
  };

  return (
    <div className={`p-4 ${typeStyles[type]} flex items-start gap-3`}>
      <span className={`text-xl flex-shrink-0 ${iconStyles[type]}`}>
        {typeIcons[type]}
      </span>
      <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
    </div>
  );
}
