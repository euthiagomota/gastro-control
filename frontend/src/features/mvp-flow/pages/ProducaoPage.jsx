import { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, ListChecks, PlayCircle } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import Table from '../../../shared/ui/Table';
import { formatDatePtBR } from '../../../shared/utils/date';
import useOperationalFlow from '../../../shared/context/useOperationalFlow';

export default function ProducaoPage() {
  const {
    days,
    selectedDayId,
    setSelectedDayId,
    productionRows,
    ingredientBreakdown,
    setProducaoStatus,
    resetProducao,
  } = useOperationalFlow();
  const [feedback, setFeedback] = useState(null);

  const selectedDay = days.find((day) => day.id === selectedDayId) || days[0];
  const today = selectedDay ? formatDatePtBR(selectedDay.date) : formatDatePtBR(new Date());

  const faltaInsumo = ingredientBreakdown.some((item) => item.saldoKg < 0);
  const pratosProntos = productionRows.filter((item) => item.status === 'Concluido').length;

  const metrics = [
    { label: 'Total para produzir', value: `${productionRows.reduce((sum, item) => sum + item.produzir, 0)} un`, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: '🏭' },
    { label: 'Pratos em andamento', value: `${pratosProntos} pratos`, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', icon: '✅' },
    { label: 'Dependem de compra', value: faltaInsumo ? 'Sim' : 'Nao', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: '⚠️' },
    { label: 'Base do plano', value: 'Calculo + Estoque', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: '💡' },
  ];

  const columns = [
    { key: 'prato', label: 'Prato' },
    { key: 'previsto', label: 'Previsto' },
    { key: 'produzir', label: 'Produzir' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
          value === 'Em preparo'
            ? 'bg-blue-100 text-blue-700'
            : value === 'Concluido'
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'acoes',
      label: 'Acoes',
      render: (_, row) => (
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="xs"
            className="!rounded-xl"
            onClick={() => {
              setProducaoStatus(selectedDayId, row.id, 'Em preparo');
              setFeedback({ type: 'success', message: `${row.prato} marcado como Em preparo.` });
            }}
            disabled={row.status === 'Concluido'}
          >
            <PlayCircle size={13} />
            <span className="hidden sm:inline">Iniciar</span>
          </Button>
          <Button
            variant="primary"
            size="xs"
            className="!rounded-xl"
            onClick={() => {
              setProducaoStatus(selectedDayId, row.id, 'Concluido');
              setFeedback({ type: 'success', message: `${row.prato} concluido.` });
            }}
            disabled={row.status === 'Concluido'}
          >
            <CheckCircle2 size={13} />
            <span className="hidden sm:inline">Finalizar</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Producao</h1>
          <p className="text-sm text-gray-500 mt-1">Aqui voce executa o plano montado com base no Calculo e validado no Estoque.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 w-full sm:w-auto" data-tour="producao-day-selector">
            <select
              value={selectedDayId || ''}
              onChange={(event) => setSelectedDayId(event.target.value)}
              className="bg-transparent outline-none"
            >
              {days.map((day) => (
                <option key={day.id} value={day.id}>{day.weekdayLabel} - {day.dayNumber}</option>
              ))}
            </select>
            <CalendarDays size={15} />
          </div>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5 w-full sm:w-auto"
            onClick={() => {
              resetProducao(selectedDayId);
              setFeedback({ type: 'success', message: 'Plano de producao atualizado para o dia selecionado.' });
            }}
          >
            <ListChecks size={15} />
            Gerar plano
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 size={16} />
          <p className="font-medium">{feedback.message}</p>
        </div>
      )}

      <Card className="rounded-3xl !p-4 border border-primary-100 bg-primary-50">
        <p className="text-sm text-primary-900 leading-relaxed">
          O que fazer aqui: iniciar e acompanhar os pratos planejados. Se houver falta de insumo, volte para Estoque e ajuste antes de continuar.
        </p>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6" data-tour="producao-summary">
        {metrics.map((metric) => (
          <Card key={metric.label} className={`rounded-3xl border ${metric.border} ${metric.bg} !p-4`}>
            <div className="text-lg mb-2">{metric.icon}</div>
            <p className={`text-lg sm:text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            <p className="text-xs sm:text-sm text-gray-500">{metric.label}</p>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl" data-tour="producao-plan">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-xl font-semibold text-gray-900">Plano de producao - {today}</h2>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" disabled>
            Gerar lista de compras (Em desenvolvimento)
          </Button>
        </div>

        <Table columns={columns} data={productionRows} />
      </Card>
    </div>
  );
}
