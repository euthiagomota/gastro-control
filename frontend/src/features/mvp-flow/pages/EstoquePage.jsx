import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Package } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import Table from '../../../shared/ui/Table';
import useOperationalFlow from '../../../shared/context/useOperationalFlow';

export default function EstoquePage() {
  const navigate = useNavigate();
  const {
    days,
    selectedDayId,
    setSelectedDayId,
    ingredientBreakdown,
  } = useOperationalFlow();
  const [searchTerm, setSearchTerm] = useState('');

  const estoqueData = useMemo(() => {
    return ingredientBreakdown.map((item, index) => ({
      id: index + 1,
      ingrediente: item.ingrediente,
      necessario: item.necessarioKg,
      disponivel: item.disponivelKg,
      saldo: item.saldoKg,
      status: item.saldoKg < 0 ? 'Critico' : item.saldoKg <= 1 ? 'Atencao' : 'OK',
    }));
  }, [ingredientBreakdown]);

  const summary = useMemo(() => {
    const criticos = estoqueData.filter((item) => item.status === 'Critico').length;
    const atencao = estoqueData.filter((item) => item.status === 'Atencao').length;

    return {
      total: estoqueData.length,
      criticos,
      atencao,
    };
  }, [estoqueData]);

  const filteredData = useMemo(() => {
    return estoqueData.filter((item) => item.ingrediente.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [estoqueData, searchTerm]);

  const columns = [
    { key: 'ingrediente', label: 'Ingrediente' },
    {
      key: 'necessario',
      label: 'Necessario (kg)',
      render: (value) => <span className="font-semibold">{value.toFixed(2)}</span>,
    },
    {
      key: 'disponivel',
      label: 'Disponivel (kg)',
      render: (value) => <span className="font-semibold">{value.toFixed(2)}</span>,
    },
    {
      key: 'saldo',
      label: 'Saldo (kg)',
      render: (value) => (
        <span className={`font-semibold ${value < 0 ? 'text-red-700' : value > 0 ? 'text-green-700' : 'text-gray-700'}`}>
          {value > 0 ? '+' : ''}{value.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
          value === 'Critico'
            ? 'bg-red-100 text-red-700'
            : value === 'Atencao'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-green-100 text-green-700'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Estoque</h1>
          <p className="text-sm text-gray-500 mt-1">Aqui voce compara o necessario (vindo do Calculo) com o disponivel.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5 w-full sm:w-auto"
            onClick={() => navigate('/admin/calculo')}
          >
            <Plus size={15} />
            Ajustar estoque
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => navigate('/admin/producao')}
            data-tour="estoque-go-to-producao-button"
          >
            Ir para Producao
          </Button>
        </div>
      </div>

      <Card className="rounded-3xl !p-4 border border-primary-100 bg-primary-50">
        <p className="text-sm text-primary-900">
          O que fazer aqui: identificar ingredientes com saldo negativo e decidir compra ou reposicao antes de iniciar a producao.
        </p>
      </Card>

      <Card className="rounded-3xl !p-4 border border-gray-200" data-tour="estoque-day-selector">
        <div className="flex items-center gap-2 flex-wrap">
          <label htmlFor="estoque-day" className="text-xs text-gray-500 font-semibold">Dia do planejamento</label>
          <select
            id="estoque-day"
            value={selectedDayId || ''}
            onChange={(event) => setSelectedDayId(event.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          >
            {days.map((day) => (
              <option key={day.id} value={day.id}>{day.weekdayLabel} - {day.dayNumber}</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" data-tour="estoque-summary">
        <Card className="rounded-3xl !p-4 border border-blue-200 bg-blue-50">
          <p className="text-xs font-semibold text-blue-700 mb-1">Ingredientes avaliados</p>
          <p className="text-2xl font-bold text-blue-900">{summary.total}</p>
        </Card>
        <Card className="rounded-3xl !p-4 border border-red-200 bg-red-50">
          <p className="text-xs font-semibold text-red-700 mb-1">Criticos</p>
          <p className="text-2xl font-bold text-red-900">{summary.criticos}</p>
        </Card>
        <Card className="rounded-3xl !p-4 border border-amber-200 bg-amber-50">
          <p className="text-xs font-semibold text-amber-700 mb-1">Atencao</p>
          <p className="text-2xl font-bold text-amber-900">{summary.atencao}</p>
        </Card>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 max-w-xl">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar ingrediente..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <Card className="rounded-3xl" data-tour="estoque-status">
        <Table columns={columns} data={filteredData} />
        {filteredData.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Package size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum item encontrado</p>
          </div>
        )}
      </Card>
    </div>
  );
}
