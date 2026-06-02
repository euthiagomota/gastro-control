import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Plus, X, Pencil, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import useOnboarding from '../../../shared/context/useOnboarding';
import useOperationalFlow from '../../../shared/context/useOperationalFlow';
import {
  FICHA_MAIN_TOUR_ID,
  FICHA_MODAL_TOUR_ID,
  fichaMainSteps,
  fichaModalSteps,
} from '../../onboarding/constants/fichaSteps';

function calculateCustoPorPorcao(ingredientes) {
  return ingredientes.reduce(
    (sum, item) => sum + ((item.gramasPorPorcao / 1000) * item.custoPorKg),
    0
  );
}

export default function FichaTecnicaPage() {
  const navigate = useNavigate();
  const { isTourOpen, currentTourId, startTour } = useOnboarding();
  const { fichasByPrato, dishNames, upsertFicha, deleteFicha } = useOperationalFlow();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFicha, setEditingFicha] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const newModalPratoRef = useRef(null);

  useEffect(() => {
    if (feedback) {
      const timeoutId = window.setTimeout(() => setFeedback(null), 3500);
      return () => window.clearTimeout(timeoutId);
    }
    return undefined;
  }, [feedback]);

  useEffect(() => {
    if (!isNewModalOpen) return;

    const frameId = window.requestAnimationFrame(() => {
      newModalPratoRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isNewModalOpen]);

  const [newFicha, setNewFicha] = useState({
    prato: '',
    customPrato: '',
    ingredientes: [{ ingrediente: '', gramasPorPorcao: '', custoPorKg: '' }],
  });

  const pratoOptions = useMemo(() => [...dishNames, 'Outro'], [dishNames]);

  const filteredPratos = useMemo(() => {
    return Object.keys(fichasByPrato)
      .filter((prato) => prato.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort();
  }, [fichasByPrato, searchTerm]);

  const fichasData = useMemo(() => {
    return filteredPratos.map((prato) => {
      const ingredientes = fichasByPrato[prato] || [];
      return {
        prato,
        ingredientes,
        custoPorPorcao: calculateCustoPorPorcao(ingredientes),
      };
    });
  }, [fichasByPrato, filteredPratos]);

  const openNewModal = () => {
    setNewFicha({
      prato: '',
      customPrato: '',
      ingredientes: [{ ingrediente: '', gramasPorPorcao: '', custoPorKg: '' }],
    });
    setIsNewModalOpen(true);

    if (isTourOpen && currentTourId === FICHA_MAIN_TOUR_ID) {
      startTour(FICHA_MODAL_TOUR_ID, fichaModalSteps, { force: true, startFrom: 'start' });
    }
  };

  const closeNewModal = () => {
    setIsNewModalOpen(false);

    if (isTourOpen && currentTourId === FICHA_MODAL_TOUR_ID) {
      const searchStepIndex = fichaMainSteps.findIndex((step) => step.id === 'ficha-search');
      const resumeIndex = searchStepIndex >= 0 ? searchStepIndex : 0;

      startTour(FICHA_MAIN_TOUR_ID, fichaMainSteps, {
        force: true,
        startAtIndex: resumeIndex,
      });
    }
  };

  const handleAddIngredient = (modal) => {
    if (modal === 'new') {
      setNewFicha((prev) => ({
        ...prev,
        ingredientes: [
          ...prev.ingredientes,
          { ingrediente: '', gramasPorPorcao: '', custoPorKg: '' },
        ],
      }));
    } else if (modal === 'edit' && editingFicha) {
      setEditingFicha((prev) => ({
        ...prev,
        ingredientes: [
          ...prev.ingredientes,
          { id: `temp-${Date.now()}`, ingrediente: '', gramasPorPorcao: '', custoPorKg: '' },
        ],
      }));
    }
  };

  const handleRemoveIngredient = (index, modal) => {
    if (modal === 'new') {
      setNewFicha((prev) => ({
        ...prev,
        ingredientes: prev.ingredientes.filter((_, i) => i !== index),
      }));
    } else if (modal === 'edit' && editingFicha) {
      setEditingFicha((prev) => ({
        ...prev,
        ingredientes: prev.ingredientes.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSaveNewFicha = (event) => {
    event.preventDefault();

    const pratoName = newFicha.prato === 'Outro' ? newFicha.customPrato.trim() : newFicha.prato;
    const validIngredientes = newFicha.ingredientes.filter(
      (item) => item.ingrediente.trim() && item.gramasPorPorcao && item.custoPorKg
    );

    if (!pratoName) {
      setFeedback({ type: 'error', message: 'Selecione ou preencha o nome do prato.' });
      return;
    }

    if (validIngredientes.length === 0) {
      setFeedback({ type: 'error', message: 'Adicione pelo menos um ingrediente valido.' });
      return;
    }

    if (fichasByPrato[pratoName]) {
      setFeedback({ type: 'error', message: `A ficha para "${pratoName}" ja existe.` });
      return;
    }

    const processedIngredientes = validIngredientes.map((item) => ({
      id: `${pratoName}-${item.ingrediente}-${Date.now()}`,
      ingrediente: item.ingrediente,
      gramasPorPorcao: Number(item.gramasPorPorcao),
      custoPorKg: Number(item.custoPorKg),
    }));

    upsertFicha(null, pratoName, processedIngredientes);

    closeNewModal();
    setFeedback({ type: 'success', message: `Ficha tecnica de "${pratoName}" criada com sucesso.` });
  };

  const handleOpenEdit = (prato) => {
    setEditingFicha({
      pratoOriginal: prato,
      prato,
      ingredientes: fichasByPrato[prato] || [],
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();

    if (!editingFicha) return;

    const validIngredientes = editingFicha.ingredientes.filter(
      (item) => item.ingrediente && item.gramasPorPorcao && item.custoPorKg
    );

    if (validIngredientes.length === 0) {
      setFeedback({ type: 'error', message: 'Mantenha pelo menos um ingrediente valido.' });
      return;
    }

    const processedIngredientes = validIngredientes.map((item) => ({
      ...item,
      gramasPorPorcao: Number(item.gramasPorPorcao),
      custoPorKg: Number(item.custoPorKg),
    }));

    upsertFicha(editingFicha.pratoOriginal, editingFicha.prato, processedIngredientes);

    setIsEditModalOpen(false);
    setEditingFicha(null);
    setFeedback({ type: 'success', message: `Ficha de "${editingFicha.prato}" atualizada com sucesso.` });
  };

  const handleDeleteFicha = (prato) => {
    if (!window.confirm(`Deseja realmente excluir a ficha de "${prato}"?`)) return;

    deleteFicha(prato);

    setFeedback({ type: 'success', message: `Ficha de "${prato}" excluida com sucesso.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" data-tour="ficha-header">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Fichas Tecnicas</h1>
          <p className="text-sm text-gray-500 mt-1">Defina ingredientes e quantidade por porcao de cada prato.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" className="flex items-center gap-1.5 w-full sm:w-auto" onClick={openNewModal} data-tour="ficha-new-button">
            <Plus size={15} />
            Nova ficha
          </Button>
          <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => navigate('/admin/calculo')} data-tour="ficha-go-to-calculo-button">
            Ir para Calculo
          </Button>
        </div>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <p className="font-medium">{feedback.message}</p>
        </div>
      )}

      <Card className="rounded-3xl !p-4 border border-primary-100 bg-primary-50">
        <p className="text-sm text-primary-900 leading-relaxed">
          <span className="font-semibold">Conexao com o fluxo:</span> os dados desta tela alimentam diretamente o Calculo.
          Se a ficha mudar, a necessidade de ingredientes tambem muda. Voce pode editar, adicionar e remover fichas a qualquer momento.
        </p>
      </Card>

      <Card className="rounded-3xl !p-4 border border-amber-200 bg-amber-50" data-tour="ficha-units-info">
        <p className="text-sm text-amber-900 leading-relaxed">
          <span className="font-semibold">Unidades de medida:</span> Quantidade por porcao sempre em <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded">gramas (g)</span>. 
          Custo sempre em <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded">R$ por quilograma (R$/kg)</span>. 
          Os valores sao calculados automaticamente durante a producao.
        </p>
      </Card>

      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 max-w-xl" data-tour="ficha-search">
        <Search size={16} className="text-gray-400" />
        <input
          className="w-full bg-transparent outline-none"
          placeholder="Buscar por prato..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="space-y-4" data-tour="ficha-cards">
        {fichasData.map((ficha) => (
          <Card key={ficha.prato} className="rounded-3xl !p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{ficha.prato}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Custo estimado por porção:
                </p>
                <p className="text-lg font-bold text-primary-700 mt-1">
                  R$ {ficha.custoPorPorcao.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(ficha.prato)}
                  className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <Pencil size={12} />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteFicha(ficha.prato)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={12} />
                  Excluir
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Ingrediente</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Quantidade</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Custo</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Total por porcao</th>
                  </tr>
                </thead>
                <tbody>
                  {ficha.ingredientes.map((item) => (
                    <tr key={item.id} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2 text-sm text-gray-700 font-medium">{item.ingrediente}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        <span className="font-mono">{item.gramasPorPorcao}</span>
                        <span className="text-gray-500 ml-1">g</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        <span className="text-gray-600">R$</span>
                        <span className="font-mono ml-1">{item.custoPorKg.toFixed(2)}</span>
                        <span className="text-gray-500 ml-1">/kg</span>
                      </td>
                      <td className="px-4 py-2 text-sm font-semibold text-gray-900">
                        R$ {((item.gramasPorPorcao / 1000) * item.custoPorKg).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>

      {fichasData.length === 0 && (
        <Card className="rounded-3xl !p-6 text-center border border-dashed border-gray-300 bg-gray-50">
          <p className="text-sm font-semibold text-gray-800">Nenhuma ficha encontrada</p>
          <p className="text-xs text-gray-500 mt-1">Crie uma nova ficha tecnica para comecar.</p>
          <Button variant="primary" size="sm" className="mt-3 mx-auto" onClick={openNewModal}>
            <Plus size={15} />
            Criar primeira ficha
          </Button>
        </Card>
      )}

      {/* Modal Nova Ficha */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-[110]" data-tour="ficha-new-modal">
          <div className="absolute inset-0 bg-slate-900/45" onClick={closeNewModal} />
          <div className="relative h-full w-full flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white border border-gray-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between gap-2 mb-4 sticky top-0 bg-white pb-3 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900" data-tour="ficha-modal-title">Nova Ficha Tecnica</h3>
                <button
                  type="button"
                  onClick={closeNewModal}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveNewFicha} className="space-y-4">
                <div>
                  <label htmlFor="new-prato" className="block text-sm font-semibold text-gray-700 mb-1.5">Prato</label>
                  <select
                    ref={newModalPratoRef}
                    id="new-prato"
                    data-tour="ficha-modal-prato"
                    value={newFicha.prato}
                    onChange={(event) => setNewFicha((prev) => ({ ...prev, prato: event.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    required
                  >
                    <option value="">Selecione um prato</option>
                    {pratoOptions.map((dish) => (
                      <option key={dish} value={dish}>{dish}</option>
                    ))}
                  </select>
                </div>

                {newFicha.prato === 'Outro' && (
                  <div>
                    <label htmlFor="new-custom-prato" className="block text-sm font-semibold text-gray-700 mb-1.5">Nome do prato</label>
                    <input
                      id="new-custom-prato"
                      type="text"
                      value={newFicha.customPrato}
                      onChange={(event) => setNewFicha((prev) => ({ ...prev, customPrato: event.target.value }))}
                      placeholder="Ex.: Strogonoff de frango"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                      required
                    />
                  </div>
                )}

                <div data-tour="ficha-modal-ingredients">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Ingredientes</label>
                    <button
                      type="button"
                      onClick={() => handleAddIngredient('new')}
                      className="text-xs font-medium text-primary-700 hover:text-primary-800"
                    >
                      <Plus size={14} className="inline mr-1" />
                      Adicionar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 italic">Quantidade em gramas (g) • Custo em R$/kg</p>
                  <div className="space-y-2">
                    {newFicha.ingredientes.map((ing, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={ing.ingrediente}
                            onChange={(event) => {
                              const updated = [...newFicha.ingredientes];
                              updated[index].ingrediente = event.target.value;
                              setNewFicha((prev) => ({ ...prev, ingredientes: updated }));
                            }}
                            placeholder="Nome do ingrediente"
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={ing.gramasPorPorcao}
                            onChange={(event) => {
                              const updated = [...newFicha.ingredientes];
                              updated[index].gramasPorPorcao = event.target.value;
                              setNewFicha((prev) => ({ ...prev, ingredientes: updated }));
                            }}
                            placeholder="0"
                            className="w-16 rounded-xl border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                          />
                          <span className="text-xs font-semibold text-gray-600 px-2">g</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold text-gray-600">R$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={ing.custoPorKg}
                            onChange={(event) => {
                              const updated = [...newFicha.ingredientes];
                              updated[index].custoPorKg = event.target.value;
                              setNewFicha((prev) => ({ ...prev, ingredientes: updated }));
                            }}
                            placeholder="0"
                            className="w-16 rounded-xl border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                          />
                          <span className="text-xs font-semibold text-gray-600 px-2">/kg</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index, 'new')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button type="button" variant="outline" size="sm" className="w-full" onClick={closeNewModal}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="w-full" data-tour="ficha-modal-submit">
                    Criar ficha
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Ficha */}
      {isEditModalOpen && editingFicha && (
        <div className="fixed inset-0 z-[110]">
          <div className="absolute inset-0 bg-slate-900/45" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative h-full w-full flex items-center justify-center p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white border border-gray-200 shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between gap-2 mb-4 sticky top-0 bg-white pb-3 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Editar Ficha: {editingFicha.prato}</h3>
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
                    value={editingFicha.prato}
                    onChange={(event) => setEditingFicha((prev) => ({ ...prev, prato: event.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Ingredientes</label>
                    <button
                      type="button"
                      onClick={() => handleAddIngredient('edit')}
                      className="text-xs font-medium text-primary-700 hover:text-primary-800"
                    >
                      <Plus size={14} className="inline mr-1" />
                      Adicionar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 italic">Quantidade em gramas (g) • Custo em R$/kg</p>
                  <div className="space-y-2">
                    {editingFicha.ingredientes.map((ing, index) => (
                      <div key={ing.id} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={ing.ingrediente}
                            onChange={(event) => {
                              const updated = [...editingFicha.ingredientes];
                              updated[index].ingrediente = event.target.value;
                              setEditingFicha((prev) => ({ ...prev, ingredientes: updated }));
                            }}
                            placeholder="Nome do ingrediente"
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={ing.gramasPorPorcao}
                            onChange={(event) => {
                              const updated = [...editingFicha.ingredientes];
                              updated[index].gramasPorPorcao = event.target.value;
                              setEditingFicha((prev) => ({ ...prev, ingredientes: updated }));
                            }}
                            placeholder="0"
                            className="w-16 rounded-xl border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                          />
                          <span className="text-xs font-semibold text-gray-600 px-2">g</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold text-gray-600">R$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={ing.custoPorKg}
                            onChange={(event) => {
                              const updated = [...editingFicha.ingredientes];
                              updated[index].custoPorKg = event.target.value;
                              setEditingFicha((prev) => ({ ...prev, ingredientes: updated }));
                            }}
                            placeholder="0"
                            className="w-16 rounded-xl border border-gray-200 px-2.5 py-2 text-xs outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                          />
                          <span className="text-xs font-semibold text-gray-600 px-2">/kg</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index, 'edit')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
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
