export default function ProcessFlow() {
  const steps = ['Demanda', 'Ficha', 'Cálculo', 'Estoque', 'Ação'];

  return (
    <div className="bg-primary-700 rounded-xl p-6 text-white">
      <h4 className="text-sm font-bold mb-4">Lógica GastroControl</h4>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="bg-primary-600 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap">
              {step}
            </div>
            {idx < steps.length - 1 && (
              <span className="text-primary-400">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
