export default function NavigationProgress({ isLoading }) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] flex items-start justify-center px-4 pt-24">
      <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/90 backdrop-blur-xl shadow-2xl p-5 text-center transition-opacity duration-300 opacity-100">
        <div className="mx-auto mb-4 h-10 w-10 rounded-full border-4 border-primary-700 border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-gray-900">Carregando...</p>
        <p className="text-xs text-gray-500 mt-1">Aguarde enquanto a página é atualizada.</p>
      </div>
    </div>
  );
}
