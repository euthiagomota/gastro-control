import { useNavigate } from 'react-router-dom';
import { MapPin, Users, ChevronRight } from 'lucide-react';

export default function UnidadesPage() {
  const navigate = useNavigate();

  const unidades = [
    {
      id: 1,
      name: 'Restaurante Boa Mesa',
      status: 'aberto',
      location: 'Recife, PE',
      employees: 12,
      type: 'Restaurante',
      emoji: '🏪',
      color: 'from-primary-50 to-primary-100',
    },
    {
      id: 2,
      name: 'Dark Kitchen Recife',
      status: 'aberto',
      location: 'Recife, PE',
      employees: 6,
      type: 'Dark Kitchen',
      emoji: '🍽️',
      color: 'from-violet-50 to-violet-100',
    },
    {
      id: 3,
      name: 'Food Truck Centro',
      status: 'fechado',
      location: 'Olinda, PE',
      employees: 3,
      type: 'Food Truck',
      emoji: '🚚',
      color: 'from-gray-50 to-gray-100',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F3] flex items-center justify-center p-4 sm:p-6 py-8 sm:py-10">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-center gap-2.5 mb-5 sm:mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-700 text-white flex items-center justify-center font-extrabold text-xs">GC</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">GastroControl</h1>
        </div>

        <div className="text-center mb-6 sm:mb-7">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-1.5">Selecionar unidade</h2>
          <p className="text-gray-500 text-sm sm:text-base">Escolha qual restaurante ou unidade deseja acessar</p>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {unidades.map((unidade) => (
            <button
              key={unidade.id}
              onClick={() => navigate('/admin/demanda')}
              className="w-full group bg-white rounded-2xl border border-gray-200 p-3.5 sm:p-4 hover:border-gray-300 hover:shadow-sm transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center text-lg shadow-sm">
                  {unidade.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-lg sm:text-2xl leading-tight truncate">{unidade.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      unidade.status === 'aberto' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {unidade.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500 text-sm sm:text-base">
                    <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{unidade.location}</span>
                    <span className="inline-flex items-center gap-1.5"><Users size={14} />{unidade.employees} funcionários</span>
                    <span>{unidade.type}</span>
                  </div>
                </div>

                <ChevronRight size={18} className="text-gray-300 group-hover:text-primary-700 transition-colors" />
              </div>
            </button>
          ))}
        </div>

        <button className="w-full mt-3.5 rounded-2xl border-2 border-dashed border-gray-300 py-3 sm:py-3.5 text-gray-500 hover:bg-white transition-colors text-sm sm:text-base font-medium">
          + Adicionar nova unidade
        </button>
      </div>
    </div>
  );
}
