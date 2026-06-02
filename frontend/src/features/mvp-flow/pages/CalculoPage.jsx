import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import Table from '../../../shared/ui/Table';
import useOperationalFlow from '../../../shared/context/useOperationalFlow';

export default function CalculoPage() {
  const navigate = useNavigate();
  const {
    days,
    selectedDayId,
    setSelectedDayId,
    demandsForSelectedDay,
    ingredientBreakdown,
    marginPercent,
    setMarginPercent,
    setEstoqueValue,
  } = useOperationalFlow();

  const ingredientRows = useMemo(() => {
    return ingredientBreakdown.map((item) => ({
      ingrediente: item.ingrediente,
      necessarioKg: item.necessarioKg,
      disponivelKg: item.disponivelKg,
      saldoKg: item.saldoKg,
      acao: item.saldoKg < 0 ? 'Comprar' : item.saldoKg > 0 ? 'Sobra' : 'No ponto',
    }));
  }, [ingredientBreakdown]);

  const totals = useMemo(() => {
    const totalPratos = demandsForSelectedDay.reduce((sum, row) => sum + row.previsto, 0);
    const totalIngredientes = ingredientBreakdown.reduce((sum, item) => sum + item.necessarioKg, 0);
    const risco = ingredientRows.filter((row) => row.saldoKg < 0).length;

    return {
      totalPratos,
      totalIngredientes: totalIngredientes.toFixed(2),
      risco,
    };
  }, [demandsForSelectedDay, ingredientBreakdown, ingredientRows]);

  const columns = [
    { key: 'ingrediente', label: 'Ingrediente' },
    {
      key: 'necessarioKg',
      label: 'Necessario (kg)',
      render: (value) => <span className="font-semibold">{value.toFixed(2)}</span>,
    },
    {
      key: 'disponivelKg',
      label: 'Disponivel (kg)',
      render: (value, row) => (
        <input
          type="number"
          step="0.1"
          value={value}
          onChange={(event) => {
            const nextValue = Number(event.target.value);
            setEstoqueValue(row.ingrediente, Number.isFinite(nextValue) ? nextValue : 0);
          }}
          className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      ),
    },
    {
      key: 'saldoKg',
      label: 'Saldo (kg)',
      render: (value) => (
        <span className={`font-semibold ${value < 0 ? 'text-red-700' : value > 0 ? 'text-green-700' : 'text-gray-700'}`}>
          {value > 0 ? '+' : ''}{value.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'acao',
      label: 'Acao',
      render: (value) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
          value === 'No ponto'
            ? 'bg-gray-100 text-gray-700'
            : value === 'Comprar'
              ? 'bg-red-100 text-red-700'
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
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Calculo</h1>
          <p className="text-sm text-gray-500 mt-1">Aqui o sistema converte pratos previstos em necessidade de ingredientes.</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => navigate('/admin/estoque')}
          data-tour="calculo-go-to-estoque-button"
        >
          Proxima etapa: Estoque {'->'}
        </Button>
      </div>

      <Card className="rounded-3xl !p-4 border border-primary-100 bg-primary-50">
        <p className="text-sm text-primary-900 leading-relaxed">
          De onde vem os numeros: <span className="font-semibold">Demanda</span> informa quantos pratos vao ser produzidos.
          <span className="font-semibold"> Fichas Tecnicas</span> informam os ingredientes por porcao. Aqui juntamos os dois.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="!p-4 rounded-3xl border border-blue-200 bg-blue-50">
          <p className="text-xs text-blue-700 font-semibold mb-1">Pratos previstos</p>
          <p className="text-2xl font-bold text-blue-900">{totals.totalPratos}</p>
          <p className="text-xs text-blue-800">Somatorio vindo da Demanda</p>
        </Card>
        <Card className="!p-4 rounded-3xl border border-primary-200 bg-primary-50">
          <p className="text-xs text-primary-700 font-semibold mb-1">Ingredientes necessarios</p>
          <p className="text-2xl font-bold text-primary-900">{totals.totalIngredientes} kg</p>
          <p className="text-xs text-primary-800">Inclui margem de seguranca</p>
        </Card>
        <Card className="!p-4 rounded-3xl border border-red-200 bg-red-50">
          <p className="text-xs text-red-700 font-semibold mb-1">Itens com risco</p>
          <p className="text-2xl font-bold text-red-900">{totals.risco}</p>
          <p className="text-xs text-red-800">Precisam de compra ou reposicao</p>
        </Card>
      </div>

      <Card className="rounded-3xl !p-4 border border-gray-200" data-tour="calculo-formula">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Como o calculo foi feito</h2>
            <p className="text-xs text-gray-500">Formula: ingrediente por porcao x quantidade prevista de pratos.</p>
          </div>
          <div className="flex items-center gap-2" data-tour="calculo-day-selector">
            <label htmlFor="calculo-day" className="text-xs text-gray-600">Dia</label>
            <select
              id="calculo-day"
              value={selectedDayId || ''}
              onChange={(event) => setSelectedDayId(event.target.value)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              {days.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.weekdayLabel} - {day.dayNumber}
                </option>
              ))}
            </select>
          </div>
          <label className="text-xs text-gray-600 flex items-center gap-2">
            Margem de seguranca (%)
            <input
              type="number"
              min="0"
              max="30"
              step="1"
              value={marginPercent}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                setMarginPercent(Number.isFinite(nextValue) ? nextValue : 0);
              }}
              className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </label>
        </div>

        <div className="space-y-4" data-tour="calculo-breakdown">
          {ingredientBreakdown.map((ingredient) => (
            <div key={ingredient.ingrediente} className="rounded-2xl border border-gray-200 bg-white p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">{ingredient.ingrediente}</h3>
              <div className="space-y-1 text-xs text-gray-600">
                {ingredient.linhas.map((linha) => (
                  <p key={`${ingredient.ingrediente}-${linha.prato}`}>
                    {linha.prato} ({linha.previsto}x): {linha.gramasPorPorcao}g x {linha.previsto} = {linha.quantidadeKg.toFixed(2)}kg
                  </p>
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-900 mt-2">
                Total com margem: {(ingredient.necessarioKg).toFixed(2)}kg
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-3xl" data-tour="calculo-editavel">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Ajuste final antes de enviar para Estoque</h2>
        <p className="text-xs text-gray-600 mb-3">
          Edite o Disponivel para simular cenarios. O Saldo e a Acao mudam em tempo real.
        </p>
        <Table columns={columns} data={ingredientRows} />
      </Card>

      <Card className="rounded-3xl">
        <h2 className="text-base font-bold text-gray-900 mb-2">O que fazer depois</h2>
        <p className="text-sm text-gray-600 mb-4">
          Envie estes valores para Estoque. Depois, siga para Producao com o plano consolidado.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" className="flex items-center gap-1.5 w-full sm:w-auto" onClick={() => navigate('/admin/estoque')}>
            Enviar para Estoque
            <ArrowRight size={15} />
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" disabled>
            Producao apos validacao de Estoque
          </Button>
        </div>
      </Card>
    </div>
  );
}
