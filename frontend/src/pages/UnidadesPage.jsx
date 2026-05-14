import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Building2, Plus, ChevronRight, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 flex flex-col items-center justify-center p-4 sm:p-6 py-12">
      {/* Back link */}
      <div className="w-full max-w-4xl mb-4">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 text-primary-100 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao login
        </button>
      </div>

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl mb-5 shadow-lg">
            <span className="text-xl font-extrabold text-primary-700">GC</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Selecionar Unidade</h1>
          <p className="text-primary-200 text-sm sm:text-base">Escolha qual restaurante ou unidade deseja acessar</p>
        </div>

        {/* Unidades Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {unidades.map((unidade) => (
            <button
              key={unidade.id}
              onClick={() => navigate('/admin/dashboard')}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 text-left"
            >
              {/* Icon Area */}
              <div className={`bg-gradient-to-br ${unidade.color} p-8 flex items-center justify-center`}>
                <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
                  {unidade.emoji}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-1.5 truncate">
                      {unidade.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        unidade.status === 'aberto'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${unidade.status === 'aberto' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {unidade.status === 'aberto' ? 'Aberto' : 'Fechado'}
                    </span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-primary-700 flex-shrink-0 mt-0.5 transition-colors" />
                </div>

                <div className="space-y-1.5 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary-600 flex-shrink-0" />
                    <span>{unidade.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-primary-600 flex-shrink-0" />
                    <span>{unidade.employees} funcionários</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-primary-600 flex-shrink-0" />
                    <span>{unidade.type}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-primary-700 group-hover:underline flex items-center gap-1">
                    Acessar unidade
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Add New Unit */}
        <div className="flex justify-center">
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-sm backdrop-blur-sm">
            <Plus size={18} />
            Adicionar nova unidade
          </button>
        </div>
      </div>
    </div>
  );
}
