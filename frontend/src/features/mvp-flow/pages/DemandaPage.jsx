import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, CheckCircle2, AlertCircle, PackageSearch, Pencil } from 'lucide-react';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import Table from '../../../shared/ui/Table';
import { getUpcomingWeek, formatWeekRangePtBR, formatDayMonthPtBR } from '../../../shared/utils/date';
import useOnboarding from '../../../shared/context/useOnboarding';
import { DEMANDA_TOUR_ID, demandaSteps } from '../../onboarding/constants/demandaSteps';
import useOperationalFlow from '../../../shared/context/useOperationalFlow';
import { pratoService } from '../../../shared/services/pratoService';

export default function DemandaPage() {
  const navigate = useNavigate();
  const { startTourIfNeeded } = useOnboarding();
  const {
    pratos,
    dishNames,
    days,
    selectedDayId,
    demandsForSelectedDay,
    ensureDayExists,
    addDemand,
    updateDemand,
    setSelectedDayId,
  } = useOperationalFlow();
  const dateInputRef = useRef(null);

  const [newDemand, setNewDemand] = useState({
    dateKey: selectedDayId || '',
    prato: '',
    customPrato: '',
    previsto: '',
    eventoEspecial: 'Nao',
    observacao: '',
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [highlightedRowId, setHighlightedRowId] = useState(null);
  const [editingDemand, setEditingDemand] = useState(null);

  const [livePratos, setLivePratos] = useState(pratos || []);

  useEffect(() => {
    setLivePratos(pratos || []);
  }, [pratos]);

  const dishOptions = useMemo(() => {
    return [...(livePratos.map((p) => ({ id: p.id, nome: p.nome })) || []), { id: 'Outro', nome: 'Outro' }];
  }, [livePratos]);

  useEffect(() => {
    startTourIfNeeded(DEMANDA_TOUR_ID, demandaSteps, 'admin-demanda');
  }, [startTourIfNeeded]);

  useEffect(() => {
    if (!isAddModalOpen) return;

    const frameId = window.requestAnimationFrame(() => {
      dateInputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isAddModalOpen]);

  useEffect(() => {
    if (!feedback) return;

    const timeoutId = window.setTimeout(() => setFeedback(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  useEffect(() => {
    if (!highlightedRowId) return;

    const timeoutId = window.setTimeout(() => setHighlightedRowId(null), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [highlightedRowId]);

  const selectedDay = days.find((day) => day.id === selectedDayId) || days[0];
  const weekRangeLabel = formatWeekRangePtBR(days);
  const selectedDayRows = demandsForSelectedDay;

  const previstoTotal = useMemo(() => selectedDayRows.reduce((sum, row) => sum + row.previsto, 0), [selectedDayRows]);
  const vendidoTotal = useMemo(() => selectedDayRows.reduce((sum, row) => sum + (row.vendido ?? 0), 0), [selectedDayRows]);
  const resultadoCalculado = useMemo(() => selectedDayRows.filter((row) => row.resultado !== null).length, [selectedDayRows]);

  const openAddModal = () => {
    (async () => {
      try {
        // Tentar obter lista atualizada do backend
        const backendPratos = await pratoService.listarPratos();
        if (Array.isArray(backendPratos) && backendPratos.length) {
          setLivePratos(backendPratos.map((p) => ({ id: p.id, nome: p.nome })));
        }
      } catch (e) {
        // silencioso — fallback para state atual
        console.warn('Falha ao atualizar lista de pratos ao abrir modal:', e);
      } finally {
        setNewDemand({
          dateKey: selectedDayId,
          prato: '',
          customPrato: '',
          previsto: '',
          eventoEspecial: 'Nao',
          observacao: '',
        });
        setIsAddModalOpen(true);
      }
    })();
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const handleAddDemand = (event) => {
    event.preventDefault();

    const dateKey = newDemand.dateKey;
    const isId = (v) => v !== null && v !== undefined && /^\d+$/.test(String(v));
    const selectedDish = newDemand.prato === 'Outro'
      ? newDemand.customPrato.trim()
      : (isId(newDemand.prato)
        ? (livePratos.find((p) => String(p.id) === String(newDemand.prato))?.nome || String(newDemand.prato))
        : newDemand.prato);
    const previsto = Number(newDemand.previsto);

    if (!dateKey || !selectedDish || !Number.isFinite(previsto) || previsto <= 0) {
      setFeedback({
        type: 'error',
        message: 'Preencha Data, Prato e Quantidade esperada para salvar.',
      });
      return;
    }

    ensureDayExists(dateKey);
    const payload = {
      previsto,
      eventoEspecial: newDemand.eventoEspecial,
      observacao: newDemand.observacao.trim(),
    };

    if (newDemand.prato === 'Outro') {
      payload.prato = newDemand.customPrato.trim();
    } else if (isId(newDemand.prato)) {
      payload.pratoId = Number(newDemand.prato);
      payload.prato = selectedDish;
    } else {
      payload.prato = newDemand.prato;
    }

    const newItem = addDemand(dateKey, payload);

    if (!newItem) {
      setFeedback({
        type: 'error',
        message: 'Nao foi possivel salvar esta demanda. Revise os campos obrigatorios.',
      });
      return;
    }

    setSelectedDayId(dateKey);
    setIsAddModalOpen(false);
    setHighlightedRowId(newItem.id);
    setNewDemand({
      dateKey: selectedDayId,
      prato: '',
      customPrato: '',
      previsto: '',
      eventoEspecial: 'Nao',
      observacao: '',
    });

    setFeedback({
      type: 'success',
      message: 'Demanda adicionada com sucesso.',
    });
  };

  const handleOpenEdit = (row) => {
    setEditingDemand({ ...row });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    if (!editingDemand) return;

    const previsto = Number(editingDemand.previsto);
    const rawVendido = editingDemand.vendido;
    const vendido = rawVendido === '' || rawVendido === null ? null : Number(rawVendido);

    if (!Number.isFinite(previsto) || previsto < 0 || (vendido !== null && (!Number.isFinite(vendido) || vendido < 0))) {
      setFeedback({
        type: 'error',
        message: 'Previsto e Vendido precisam ser valores validos.',
      });
      return;
    }

    const nextItem = normalizeDemandRow({
      ...editingDemand,
      previsto,
      vendido,
    });

    updateDemand(selectedDayId, nextItem.id, {
      previsto,
      vendido,
    });

    setIsEditModalOpen(false);
    setEditingDemand(null);
    setHighlightedRowId(nextItem.id);
    setFeedback({
      type: 'success',
      message: `Demanda de ${nextItem.prato} atualizada com sucesso.`,
    });
  };

  const columns = [
    { key: 'prato', label: 'Prato' },
    {
      key: 'eventoEspecial',
      label: 'Evento',
      render: (value) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
          value === 'Sim' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'previsto',
      label: 'Previsto',
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: 'vendido',
      label: 'Vendido',
      render: (value) => <span className="font-semibold">{value === null ? '—' : value}</span>,
    },
    {
      key: 'resultado',
      label: 'Resultado',
      render: (value) => {
        if (value === null) return <span className="text-gray-400">aguardando vendas</span>;

        return (
          <span className={`font-bold ${value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {value > 0 ? '+' : ''}{value}
          </span>
        );
      },
    },
    {
      key: 'acoes',
      label: 'Acoes',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => handleOpenEdit(row)}
          className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          <Pencil size={12} />
          Editar
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div data-tour="demanda-header">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Demanda</h1>
          <p className="text-sm text-gray-500 mt-1">Defina a quantidade prevista de pratos. Depois siga para Fichas Tecnicas.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5 w-full sm:w-auto"
            onClick={openAddModal}
            data-tour="add-demanda-button"
          >
            <Plus size={15} />
            Adicionar demanda
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => navigate('/admin/fichas-tecnicas')}
            data-tour="go-to-fichas-button"
          >
            Ir para Fichas Tecnicas
          </Button>
        </div>
      </div>

      {feedback && (
        <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${
          feedback.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <p className="font-medium">{feedback.message}</p>
        </div>
      )}

      <Card className="rounded-3xl !p-4" data-tour="flow-connection-card">
        <p className="text-sm text-gray-700 leading-relaxed">
          Baseado na sua demanda, o sistema calcula os ingredientes necessarios na tela de Calculo.
          A Ficha Tecnica define os ingredientes por prato e tambem entra nesse calculo.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" data-tour="demand-concepts">
        <Card className="rounded-3xl !p-4 border border-blue-200 bg-blue-50">
          <p className="text-xs font-semibold text-blue-700 mb-1">Previsto</p>
          <p className="text-2xl font-bold text-blue-900">{previstoTotal}</p>
          <p className="text-xs text-blue-800">Quantidade planejada do dia</p>
        </Card>
        <Card className="rounded-3xl !p-4 border border-emerald-200 bg-emerald-50">
          <p className="text-xs font-semibold text-emerald-700 mb-1">Vendido</p>
          <p className="text-2xl font-bold text-emerald-900">{vendidoTotal}</p>
          <p className="text-xs text-emerald-800">Quantidade ja registrada</p>
        </Card>
        <Card className="rounded-3xl !p-4 border border-amber-200 bg-amber-50">
          <p className="text-xs font-semibold text-amber-700 mb-1">Resultado</p>
          <p className="text-2xl font-bold text-amber-900">{resultadoCalculado}/{selectedDayRows.length}</p>
          <p className="text-xs text-amber-800">Pratos com resultado calculado</p>
        </Card>
      </div>

      <Card className="!p-4 rounded-3xl" data-tour="week-selector">
        <p className="text-xs font-semibold text-gray-500 mb-3">Semana — {weekRangeLabel}</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {days.map((day) => {
            const active = selectedDay?.id === day.id;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayId(day.id)}
                className={`flex flex-col items-center px-3 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap flex-shrink-0 min-w-[52px] ${
                  active ? 'bg-primary-700 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs">{day.weekdayLabel}</span>
                <span className="text-base font-bold">{day.dayNumber}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white/90' : 'bg-primary-400'}`} />
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="rounded-3xl !p-4" data-tour="demanda-legend">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">Como ler esta tabela</h2>
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900">Previsto</span> = quantidade planejada. {' '}
          <span className="font-semibold text-gray-900">Vendido</span> = quantidade vendida. {' '}
          <span className="font-semibold text-gray-900">Resultado</span> so aparece quando houver Vendido.
        </p>
      </Card>

      <Card className="rounded-3xl" data-tour="demanda-table">
        <div className="flex flex-col gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Demanda — {selectedDay?.weekdayLabel} ({formatDayMonthPtBR(selectedDay.date)})
          </h2>
          <p className="text-sm text-gray-500">
            Edite os valores de Previsto e Vendido quando necessario. Depois, siga para Fichas Tecnicas.
          </p>
        </div>

        {selectedDayRows.length > 0 ? (
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              data={selectedDayRows}
              getRowClassName={(row) => (row.id === highlightedRowId ? 'bg-emerald-50' : '')}
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 py-10 px-5 text-center">
            <PackageSearch size={34} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-semibold text-gray-800 mb-1">Sem demandas para este dia</p>
            <p className="text-xs text-gray-500 mb-4">Adicione uma demanda para comecar o fluxo.</p>
            <Button variant="primary" size="sm" className="mx-auto" onClick={openAddModal}>
              <Plus size={15} />
              Adicionar demanda
            </Button>
          </div>
        )}
      </Card>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[110]" data-tour="add-demanda-modal">
          <div className="absolute inset-0 bg-slate-900/45" onClick={closeAddModal} />
          <div className="relative h-full w-full flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl bg-white border border-gray-200 shadow-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-xl font-bold text-gray-900">Adicionar demanda</h3>
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddDemand} className="space-y-4">
                <div>
                  <label htmlFor="demand-date" className="block text-sm font-semibold text-gray-700 mb-1.5">Data</label>
                  <input
                    ref={dateInputRef}
                    id="demand-date"
                    type="date"
                    value={newDemand.dateKey}
                    onChange={(event) => setNewDemand((previous) => ({ ...previous, dateKey: event.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="prato" className="block text-sm font-semibold text-gray-700 mb-1.5">Prato</label>
                  <select
                    id="prato"
                    value={newDemand.prato}
                    onChange={(event) => setNewDemand((previous) => ({ ...previous, prato: event.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    required
                  >
                    <option value="">Selecione um prato</option>
                    {dishOptions.map((dish) => (
                      <option key={dish.id} value={dish.id}>{dish.nome}</option>
                    ))}
                  </select>
                </div>

                {newDemand.prato === 'Outro' && (
                  <div>
                    <label htmlFor="customPrato" className="block text-sm font-semibold text-gray-700 mb-1.5">Nome do prato</label>
                    <input
                      id="customPrato"
                      type="text"
                      value={newDemand.customPrato}
                      onChange={(event) => setNewDemand((previous) => ({ ...previous, customPrato: event.target.value }))}
                      placeholder="Ex.: Strogonoff de frango"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="previsto" className="block text-sm font-semibold text-gray-700 mb-1.5">Quantidade esperada</label>
                  <input
                    id="previsto"
                    type="number"
                    min="1"
                    value={newDemand.previsto}
                    onChange={(event) => setNewDemand((previous) => ({ ...previous, previsto: event.target.value }))}
                    placeholder="Ex.: 24"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    required
                  />
                </div>

                <div>
                  <span className="block text-sm font-semibold text-gray-700 mb-1.5">Evento especial</span>
                  <div className="flex gap-2">
                    {['Nao', 'Sim'].map((option) => (
                      <label key={option} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="eventoEspecial"
                          value={option}
                          checked={newDemand.eventoEspecial === option}
                          onChange={(event) => setNewDemand((previous) => ({ ...previous, eventoEspecial: event.target.value }))}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="observacao" className="block text-sm font-semibold text-gray-700 mb-1.5">Observacao (opcional)</label>
                  <textarea
                    id="observacao"
                    rows={3}
                    value={newDemand.observacao}
                    onChange={(event) => setNewDemand((previous) => ({ ...previous, observacao: event.target.value }))}
                    placeholder="Ex.: demanda maior por causa de evento da empresa"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" size="sm" className="w-full" onClick={closeAddModal}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="w-full">
                    Salvar demanda
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingDemand && (
        <div className="fixed inset-0 z-[110]">
          <div className="absolute inset-0 bg-slate-900/45" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative h-full w-full flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl bg-white border border-gray-200 shadow-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-xl font-bold text-gray-900">Editar demanda</h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prato</label>
                  <input
                    type="text"
                    value={editingDemand.prato}
                    disabled
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm bg-gray-50 text-gray-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="edit-previsto" className="block text-sm font-semibold text-gray-700 mb-1.5">Quantidade prevista</label>
                    <input
                      id="edit-previsto"
                      type="number"
                      min="0"
                      value={editingDemand.previsto}
                      onChange={(event) => setEditingDemand((previous) => ({ ...previous, previsto: event.target.value }))}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-vendido" className="block text-sm font-semibold text-gray-700 mb-1.5">Quantidade vendida (opcional)</label>
                    <input
                      id="edit-vendido"
                      type="number"
                      min="0"
                      value={editingDemand.vendido ?? ''}
                      onChange={(event) => setEditingDemand((previous) => ({ ...previous, vendido: event.target.value }))}
                      placeholder="Deixe vazio enquanto aguarda vendas"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setIsEditModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="w-full">
                    Salvar alteracoes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
