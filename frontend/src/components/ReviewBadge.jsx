export default function ReviewBadge() {
  return (
    <div className="flex items-center gap-4 pt-4">
      <div className="flex items-center gap-2">
        {/* Initials Circle */}
        <div className="flex gap-1">
          {[
            { letter: 'R', bg: 'bg-primary-700' },
            { letter: 'A', bg: 'bg-primary-600' },
            { letter: 'P', bg: 'bg-primary-500' },
            { letter: 'C', bg: 'bg-amber-500' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 ${item.bg} rounded-full flex items-center justify-center text-white text-xs font-bold`}
            >
              {item.letter}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-amber-400 text-sm">
              ★
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-600">
          +1.200 restaurantes usando
        </p>
      </div>
    </div>
  );
}
