import { useState } from 'react';
import { ChevronDown, Play, Pause, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

export default function FuncionarioProducao() {
  const produtosData = [
    {
      id: 1,
      prato: 'Marmita Fitness',
      status: 'Em preparo',
      quantidade: 42,
      unidade: 'unidades',
      previsto: '10:00',
      ingredientes: ['Frango grelhado: 7,6kg', 'Arroz integral: 3,4kg', 'Brócolis: 2,5kg'],
      maisItens: 1,
    },
    {
      id: 2,
      prato: 'Smash Burguer Clássico',
      status: 'Pendente',
      quantidade: 30,
      unidade: 'unidades',
      previsto: '11:30',
      ingredientes: ['Blend carne/frango: 5,4kg', 'Pão artesanal: 30un', 'Queijo cheddar: 0,9kg'],
      maisItens: 0,
    },
    {
      id: 3,
      prato: 'Açaí Gourmet 500ml',
      status: 'Pendente',
      quantidade: 35,
      unidade: 'unidades',
      previsto: '12:00',
      ingredientes: ['Açaí: 8,75kg', 'Granola: 1,75kg', 'Banana: 35 fatias'],
      maisItens: 1,
    },
    {
      id: 4,
      prato: 'Frango Caipira ao Molho',
      status: 'Finalizado',
      quantidade: 15,
      unidade: 'unidades',
      previsto: '13:00',
      ingredientes: ['Frango caipira: 3kg', 'Batatas: 2,25kg', 'Molho de ervas: 0,45kg'],
      maisItens: 0,
    },
  ];

  const [expandedId, setExpandedId] = useState(null);

  const statusConfig = {
    'Em preparo': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-l-blue-500', icon: '👨‍🍳', dot: 'bg-blue-500' },
    'Pendente': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-l-amber-500', icon: '⏳', dot: 'bg-amber-500' },
    'Finalizado': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-l-green-500', icon: '✅', dot: 'bg-green-500' },
  };

  const metrics = [
    { label: 'Pendentes', value: 2, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Em preparo', value: 1, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Finalizados', value: 1, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Produção do Dia</h1>
        <p className="text-sm text-gray-500">Terça, 06/05/2026 · {produtosData.length} pratos na lista</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {metrics.map((metric, i) => (
          <Card key={i} className={`border ${metric.border} ${metric.bg} !p-4 text-center`}>
            <p className={`text-2xl font-bold ${metric.color} mb-0.5`}>{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.label}</p>
          </Card>
        ))}
      </div>

      {/* Produto Cards */}
      <div className="space-y-3">
        {produtosData.map((produto) => {
          const cfg = statusConfig[produto.status];
          const isExpanded = expandedId === produto.id;
          return (
            <Card key={produto.id} className={`!p-0 overflow-hidden border-l-4 ${cfg.border}`}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : produto.id)}
                className="w-full text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-base font-bold text-gray-900">{produto.prato}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                        <span>{cfg.icon}</span>
                        {produto.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">{produto.quantidade} {produto.unidade}</span>
                      <span className="flex items-center gap-1">⏰ Previsto: {produto.previsto}</span>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform flex-shrink-0 mt-0.5 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200 p-4 sm:p-5 bg-gray-50">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Ingredientes</h4>
                  <ul className="space-y-1.5 mb-4">
                    {produto.ingredientes.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-primary-600 font-bold mt-0.5">•</span>
                        {ing}
                      </li>
                    ))}
                    {produto.maisItens > 0 && (
                      <li className="text-sm text-primary-700 font-medium">+{produto.maisItens} ingrediente(s) mais</li>
                    )}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {produto.status === 'Pendente' && (
                      <>
                        <Button variant="primary" size="sm" className="flex items-center gap-1.5">
                          <Play size={14} />Iniciar preparo
                        </Button>
                        <Button variant="outline" size="sm">Ver detalhes</Button>
                      </>
                    )}
                    {produto.status === 'Em preparo' && (
                      <>
                        <Button variant="primary" size="sm" className="flex items-center gap-1.5">
                          <CheckCircle size={14} />Finalizar
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                          <Pause size={14} />Pausar
                        </Button>
                        <Button variant="outline" size="sm">Ver detalhes</Button>
                      </>
                    )}
                    {produto.status === 'Finalizado' && (
                      <Button variant="outline" size="sm">Ver detalhes</Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Help Card */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">ℹ️</span>
          <div>
            <h3 className="text-sm font-bold text-blue-900 mb-1">Dica de uso</h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              Clique em um prato para expandir e ver os ingredientes completos. Use os botões para atualizar o status da produção.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
