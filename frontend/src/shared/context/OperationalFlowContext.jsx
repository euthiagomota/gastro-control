import { useCallback, useMemo, useState, useEffect } from 'react';
import OperationalFlowContext from './OperationalFlowContextValue';
import { buildIngredientBreakdown, calculateResultado } from '../../features/mvp-flow/data/operationalFlow';
import { getUpcomingWeek } from '../utils/date';
import { pratoService } from '../services/pratoService';
import { estoqueService } from '../services/estoqueService';
import { demandaService } from '../services/demandaService';
import { ingredienteService } from '../services/ingredienteService';

const FLOW_STORAGE_KEY = 'gastrocontrol:operational-flow:v1';
const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

// Removed hardcoded demo dish details; backend provides prato metadata

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeDemandRow(row) {
  const derived = calculateResultado(row.previsto, row.vendido);
  return {
    ...row,
    resultado: derived.resultado,
    status: derived.status,
  };
}

function mapPratoResponseToFlowPrato(p) {
  return {
    id: p.id,
    nome: p.nome,
    categoria: p.categoria || 'Pratos',
    descricao: p.descricao || `Ficha técnica de ${p.nome}`,
    tempo: p.tempoPreparo ? `${p.tempoPreparo} min` : '20 min',
    rating: '4.8',
    venda: p.precoVenda ? `R$ ${Number(p.precoVenda).toFixed(2).replace('.', ',')}` : 'R$ 0,00',
    custo: p.custoTotal ? `R$ ${Number(p.custoTotal).toFixed(2).replace('.', ',')}` : 'R$ 0,00',
    margem: p.margemLucro ? `${Number(p.margemLucro).toFixed(0)}%` : '0%',
    imagem: p.imagemUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=420&fit=crop',
    ativo: p.ativo !== false,
  };
}

function buildDefaultPratos() {
  // Removed mock-based default pratos; backend provides pratos via loadBackendData
  return [];
}

function buildDefaultFichas() {
  // Removed mock-based default fichas; backend provides fichas via loadBackendData
  return {};
}

function buildDefaultDaysAndDemands() {
  // Removed mock-based default days and demands; initial days are built in buildInitialState
  return { days: [], demandsByDay: {} };
}

function buildInitialState() {
  // Inicializa o estado vazio — dados serão carregados do backend em seguida.
  const upcomingDays = getUpcomingWeek(new Date(), 7).map((day) => ({
    id: toDateKey(day.date),
    dateISO: day.date.toISOString(),
  }));

  const emptyDemandsByDay = upcomingDays.reduce((acc, d) => {
    acc[d.id] = [];
    return acc;
  }, {});

  return {
    pratos: [],
    fichasByPrato: {},
    days: upcomingDays,
    demandsByDay: emptyDemandsByDay,
    estoque: {},
    producaoStatusByDay: {},
    calculation: {
      selectedDayId: upcomingDays[0]?.id || null,
      marginPercent: 5,
    },
  };
}

function normalizeHydratedState(state) {
  const fallback = buildInitialState();

  // Normalize fichasByPrato to ensure numeric values
  const normalizedFichasByPrato = state?.fichasByPrato
    ? Object.entries(state.fichasByPrato).reduce((acc, [prato, ingredientes]) => {
        acc[prato] = Array.isArray(ingredientes)
          ? ingredientes.map((item) => ({
              ...item,
              id: item.id || `${prato}-${item.ingrediente}`,
              gramasPorPorcao: Number(item.gramasPorPorcao) || 0,
              custoPorKg: Number(item.custoPorKg) || 0,
            }))
          : [];
        return acc;
      }, {})
    : fallback.fichasByPrato;

  return {
    ...fallback,
    ...state,
    pratos: state?.pratos?.length ? state.pratos : fallback.pratos,
    fichasByPrato: normalizedFichasByPrato,
    days: state?.days?.length ? state.days : fallback.days,
    demandsByDay: state?.demandsByDay || fallback.demandsByDay,
    estoque: state?.estoque || fallback.estoque,
    producaoStatusByDay: state?.producaoStatusByDay || fallback.producaoStatusByDay,
    calculation: {
      ...fallback.calculation,
      ...(state?.calculation || {}),
    },
  };
}

function getStoredState() {
  if (typeof window === 'undefined') {
    return buildInitialState();
  }

  try {
    const raw = window.localStorage.getItem(FLOW_STORAGE_KEY);
    if (!raw) return buildInitialState();
    return normalizeHydratedState(JSON.parse(raw));
  } catch {
    return buildInitialState();
  }
}

function sanitizeForStorage(state) {
  return {
    ...state,
    demandsByDay: Object.entries(state.demandsByDay).reduce((accumulator, [dayId, rows]) => {
      accumulator[dayId] = rows.map((row) => {
        const normalized = normalizeDemandRow(row);
        return {
          ...normalized,
          vendido: normalized.vendido === '' ? null : normalized.vendido,
        };
      });
      return accumulator;
    }, {}),
  };
}

function createEmptyFicha() {
  return [{ id: `ficha-item-${Date.now()}`, ingrediente: '', gramasPorPorcao: '', custoPorKg: '' }];
}

export function OperationalFlowProvider({ children }) {
  const [flowState, setFlowState] = useState(getStoredState);

  const updateState = useCallback((updater) => {
    setFlowState((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater;
      const safeState = sanitizeForStorage(next);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(safeState));
      }
      return safeState;
    });
  }, []);

  const selectedDayId = flowState.calculation.selectedDayId || flowState.days[0]?.id || null;

  const days = useMemo(() => {
    return flowState.days.map((day) => ({
      ...day,
      date: new Date(day.dateISO),
      weekdayLabel: WEEKDAY_SHORT[new Date(day.dateISO).getDay()],
      dayNumber: String(new Date(day.dateISO).getDate()).padStart(2, '0'),
    }));
  }, [flowState.days]);

  const demandsForSelectedDay = flowState.demandsByDay[selectedDayId] || [];

  const fichasForCalculation = useMemo(() => {
    return Object.entries(flowState.fichasByPrato).reduce((accumulator, [prato, ingredientes]) => {
      accumulator[prato] = ingredientes.map((item) => ({
        ingrediente: item.ingrediente,
        gramasPorPorcao: Number(item.gramasPorPorcao) || 0,
        custoPorKg: Number(item.custoPorKg) || 0,
      }));
      return accumulator;
    }, {});
  }, [flowState.fichasByPrato]);

  const ingredientBreakdown = useMemo(() => {
    return buildIngredientBreakdown(
      demandsForSelectedDay,
      Number(flowState.calculation.marginPercent) || 0,
      fichasForCalculation,
      flowState.estoque
    );
  }, [demandsForSelectedDay, flowState.calculation.marginPercent, fichasForCalculation, flowState.estoque]);

  const productionRows = useMemo(() => {
    const statusByRow = flowState.producaoStatusByDay[selectedDayId] || {};

    return demandsForSelectedDay.map((row) => ({
      id: row.id,
      prato: row.prato,
      previsto: row.previsto,
      produzir: row.previsto,
      status: statusByRow[row.id] || 'Pendente',
    }));
  }, [demandsForSelectedDay, flowState.producaoStatusByDay, selectedDayId]);

  // Sincronização assíncrona dos dados do backend
  const loadBackendData = useCallback(async () => {
    try {
      const pratosList = await pratoService.listarPratos();
      const mappedPratos = pratosList.map(mapPratoResponseToFlowPrato);
      
      const fichas = {};
      for (const prato of pratosList) {
        const ft = await pratoService.listarFichaTecnica(prato.id);
        fichas[prato.nome] = ft.map(item => ({
          id: item.id,
          ingrediente: item.ingredienteNome,
          gramasPorPorcao: (Number(item.qtdPorPorcao) || 0) * 1000,
          custoPorKg: Number(item.custoUnitarioIngrediente) || 0,
        }));
      }

      const estoqueList = await estoqueService.listEstoque();
      const currentEstoque = {};
      estoqueList.forEach(item => {
        const name = item.ingredienteNome;
        currentEstoque[name] = (currentEstoque[name] || 0) + (Number(item.qtdDisponivel) || 0);
      });

      const demandasPage = await demandaService.listDemandas();
      const demandasList = demandasPage?.content || [];
      
      const demandsByDay = {};
      const producaoStatusByDay = {};
      
      demandasList.forEach(dem => {
        if (dem.deleted) return;
        const dateKey = dem.dataInicio;
        if (!demandsByDay[dateKey]) {
          demandsByDay[dateKey] = [];
          producaoStatusByDay[dateKey] = {};
        }
        
        dem.pratos.forEach(p => {
          const localVendidoKey = `gastrocontrol:vendido:${dem.id}:${p.pratoNome}`;
          const localVendido = localStorage.getItem(localVendidoKey);
          
          const row = normalizeDemandRow({
            id: `${dem.id}-${p.pratoId}`,
            demandaId: dem.id,
            pratoId: p.pratoId,
            prato: p.pratoNome,
            previsto: p.quantidade,
            vendido: localVendido !== null ? Number(localVendido) : null,
            eventoEspecial: dem.observacoes?.includes('Especial') ? 'Sim' : 'Nao',
            observacao: dem.observacoes || '',
          });
          demandsByDay[dateKey].push(row);
          
          let pStatus = 'Pendente';
          if (dem.status === 'PROCESSADA') pStatus = 'Em preparo';
          if (dem.status === 'FINALIZADA') pStatus = 'Concluido';
          producaoStatusByDay[dateKey][row.id] = pStatus;
        });
      });

      const newDays = getUpcomingWeek(new Date(), 7).map((day) => ({
        id: toDateKey(day.date),
        dateISO: day.date.toISOString(),
      }));
      
      newDays.forEach(day => {
        if (!demandsByDay[day.id]) {
          demandsByDay[day.id] = [];
        }
        if (!producaoStatusByDay[day.id]) {
          producaoStatusByDay[day.id] = {};
        }
      });

      setFlowState(prev => ({
        ...prev,
        pratos: mappedPratos.length ? mappedPratos : prev.pratos,
        fichasByPrato: Object.keys(fichas).length ? fichas : prev.fichasByPrato,
        estoque: Object.keys(currentEstoque).length ? currentEstoque : prev.estoque,
        demandsByDay,
        producaoStatusByDay,
        days: newDays,
        calculation: {
          ...prev.calculation,
          selectedDayId: newDays[0]?.id || null,
        }
      }));

    } catch (e) {
      console.error("Erro ao carregar dados do backend:", e);
    }
  }, []);

  // Carregar dados no mount
  useEffect(() => {
    loadBackendData();
  }, [loadBackendData]);

  const addPrato = useCallback(async (payload) => {
    const nome = payload.nome?.trim();
    if (!nome) return;

    try {
      // 1. Criar prato no backend
      const novoPrato = await pratoService.criarPrato({
        nome,
        categoria: payload.categoria === 'Lanches' ? 'LANCHE' : 'PRATO_PRINCIPAL',
        descricao: payload.descricao || `Ficha técnica de ${nome}`,
        tempoPreparo: 20,
        porcoes: 1,
        precoVenda: 25.0
      });

      const flowPrato = mapPratoResponseToFlowPrato(novoPrato);

      updateState((previous) => {
        const exists = previous.pratos.some((dish) => dish.nome.toLowerCase() === nome.toLowerCase());
        if (exists) return previous;

        return {
          ...previous,
          pratos: [...previous.pratos, flowPrato],
          fichasByPrato: {
            ...previous.fichasByPrato,
            [nome]: previous.fichasByPrato[nome] || createEmptyFicha(),
          },
        };
      });
    } catch (error) {
      console.error("Erro ao cadastrar prato no backend:", error);
      // Fallback local
      updateState((previous) => {
        const exists = previous.pratos.some((dish) => dish.nome.toLowerCase() === nome.toLowerCase());
        if (exists) return previous;

        const nextPrato = {
          id: `dish-${Date.now()}`,
          nome,
          categoria: payload.categoria || 'Pratos',
          descricao: payload.descricao || `Descricao de ${nome}`,
          tempo: payload.tempo || '20 min',
          rating: payload.rating || '4.7',
          venda: payload.venda || 'R$ 0,00',
          custo: payload.custo || 'R$ 0,00',
          margem: payload.margem || '0%',
          imagem: payload.imagem || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=420&fit=crop',
          ativo: true,
        };

        return {
          ...previous,
          pratos: [...previous.pratos, nextPrato],
          fichasByPrato: {
            ...previous.fichasByPrato,
            [nome]: previous.fichasByPrato[nome] || createEmptyFicha(),
          },
        };
      });
    }
  }, [updateState]);

  const ensureDayExists = useCallback((dateKey) => {
    updateState((previous) => {
      if (!dateKey || previous.days.some((day) => day.id === dateKey)) {
        return previous;
      }

      const parsedDate = new Date(`${dateKey}T00:00:00`);
      if (Number.isNaN(parsedDate.getTime())) {
        return previous;
      }

      const nextDays = [...previous.days, { id: dateKey, dateISO: parsedDate.toISOString() }]
        .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());

      return {
        ...previous,
        days: nextDays,
        demandsByDay: {
          ...previous.demandsByDay,
          [dateKey]: previous.demandsByDay[dateKey] || [],
        },
      };
    });
  }, [updateState]);

  const addDemand = useCallback((dateKey, payload) => {
    const previsto = Number(payload.previsto);
    // Accept either prato name or pratoId from the UI
    if (!dateKey || (!payload.prato && !payload.pratoId) || !Number.isFinite(previsto) || previsto <= 0) {
      return null;
    }

    // Helper to detect numeric IDs (backend IDs)
    const isNumericId = (v) => v !== null && v !== undefined && /^\d+$/.test(String(v));

    // Try to resolve prato in-memory; if not available, we'll still proceed and try fetching by id in syncCreate
    const pratoInState = isNumericId(payload.pratoId)
      ? flowState.pratos.find((p) => String(p.id) === String(payload.pratoId))
      : flowState.pratos.find((p) => p.nome === (payload.prato || payload.pratoId));

    // Criar demanda no backend de forma assíncrona
    let createdRow = null;

    const syncCreate = async () => {
      try {
        // Ensure we have prato info before calling backend: try fetching if not in state
        let prato = pratoInState;
        if (isNumericId(payload.pratoId) && !prato) {
          try {
            const fetched = await pratoService.buscarPratoPorId(payload.pratoId);
            if (fetched) {
              prato = fetched;
              updateState((previous) => ({
                ...previous,
                pratos: [...previous.pratos, mapPratoResponseToFlowPrato(fetched)],
              }));
            }
          } catch (pfErr) {
            console.warn('Falha ao buscar prato por id durante criação de demanda:', pfErr);
          }
        }
        const pratoIdToSend = prato ? prato.id : (isNumericId(payload.pratoId) ? payload.pratoId : null);

        // Debug log for createDemanda payload
        console.debug('Criando demanda (payload):', {
          titulo: `${payload.prato} - ${dateKey}`,
          dataInicio: dateKey,
          pratos: [{ pratoId: pratoIdToSend, quantidade: previsto }]
        });

        const dem = await demandaService.createDemanda({
          titulo: `${payload.prato} - ${dateKey}`,
          descricao: payload.observacao || `Planejamento para ${dateKey}`,
          dataInicio: dateKey,
          dataFim: dateKey,
          tipo: 'DIARIA',
          observacoes: payload.eventoEspecial === 'Sim' ? 'Especial' : '',
          pratos: [{
            pratoId: pratoIdToSend,
            quantidade: previsto,
            observacoes: payload.observacao || ''
          }]
        });

        const row = normalizeDemandRow({
          id: `${dem.id}-${prato.id}`,
          demandaId: dem.id,
          prato: payload.prato,
          previsto,
          vendido: null,
          eventoEspecial: payload.eventoEspecial || 'Nao',
          observacao: payload.observacao || '',
        });

        updateState((previous) => ({
          ...previous,
          demandsByDay: {
            ...previous.demandsByDay,
            [dateKey]: [row, ...(previous.demandsByDay[dateKey] || []).filter(r => r.prato !== payload.prato)],
          },
        }));

      } catch (error) {
        console.error("Erro ao criar demanda no backend:", error);
      }
    };

    // Atualização local imediata com ID temporário
    const tempId = `demand-${Date.now()}`;
    const tempRow = normalizeDemandRow({
      id: tempId,
      demandaId: null,
      pratoId: prato.id,
      prato: payload.prato || prato.nome,
      previsto,
      vendido: null,
      eventoEspecial: payload.eventoEspecial || 'Nao',
      observacao: payload.observacao || '',
    });

    updateState((previous) => ({
      ...previous,
      demandsByDay: {
        ...previous.demandsByDay,
        [dateKey]: [tempRow, ...(previous.demandsByDay[dateKey] || [])],
      },
    }));

    syncCreate();

    return tempRow;
  }, [flowState.pratos, updateState]);

  const updateDemand = useCallback(async (dayId, rowId, patch) => {
    const row = flowState.demandsByDay[dayId]?.find((item) => item.id === rowId);
    const shouldSyncWithBackend = row?.demandaId && row?.pratoId && patch.previsto !== undefined;
    const nextObservacoes = patch.observacao !== undefined ? patch.observacao : row?.observacao;

    updateState((previous) => {
      const rows = previous.demandsByDay[dayId] || [];
      const updatedRows = rows.map((row) => {
        if (row.id !== rowId) return row;

        const nextPrevisto = patch.previsto !== undefined ? Number(patch.previsto) : row.previsto;
        const nextVendido = patch.vendido !== undefined
          ? (patch.vendido === '' || patch.vendido === null ? null : Number(patch.vendido))
          : row.vendido;

        if (row.demandaId && nextVendido !== null) {
          const localVendidoKey = `gastrocontrol:vendido:${row.demandaId}:${row.prato}`;
          localStorage.setItem(localVendidoKey, String(nextVendido));
        }

        return normalizeDemandRow({
          ...row,
          ...patch,
          previsto: Number.isFinite(nextPrevisto) ? nextPrevisto : row.previsto,
          vendido: nextVendido,
          observacao: nextObservacoes,
        });
      });

      return {
        ...previous,
        demandsByDay: {
          ...previous.demandsByDay,
          [dayId]: updatedRows,
        },
      };
    });

    if (shouldSyncWithBackend) {
      try {
        await demandaService.updateDemandaPrato(row.demandaId, row.pratoId, {
          quantidade: Number(patch.previsto),
          observacoes: nextObservacoes || '',
        });
      } catch (error) {
        console.error('Erro ao sincronizar demanda no backend:', error);
      }
    }
  }, [flowState.demandsByDay, updateState]);

  const deleteDemand = useCallback(async (dayId, rowId) => {
    // 1. Procurar demanda para cancelar no backend
    const rows = flowState.demandsByDay[dayId] || [];
    const targetRow = rows.find(r => r.id === rowId);
    
    if (targetRow && targetRow.demandaId) {
      try {
        await demandaService.cancelarDemanda(targetRow.demandaId);
      } catch (error) {
        console.error("Erro ao cancelar demanda no backend:", error);
      }
    }

    updateState((previous) => ({
      ...previous,
      demandsByDay: {
        ...previous.demandsByDay,
        [dayId]: (previous.demandsByDay[dayId] || []).filter((row) => row.id !== rowId),
      },
      producaoStatusByDay: {
        ...previous.producaoStatusByDay,
        [dayId]: Object.entries(previous.producaoStatusByDay[dayId] || {}).reduce((accumulator, [key, value]) => {
          if (key !== rowId) accumulator[key] = value;
          return accumulator;
        }, {}),
      },
    }));
  }, [flowState.demandsByDay, updateState]);

  const upsertFicha = useCallback((pratoOriginal, pratoName, ingredientes) => {
    const normalizedPratoName = pratoName?.trim();
    if (!normalizedPratoName) return;

    const normalizedIngredientes = ingredientes
      .filter((item) => item.ingrediente?.trim())
      .map((item) => ({
        id: item.id || `${normalizedPratoName}-${item.ingrediente}-${Date.now()}`,
        ingrediente: item.ingrediente.trim(),
        gramasPorPorcao: Number(item.gramasPorPorcao) || 0,
        custoPorKg: Number(item.custoPorKg) || 0,
      }));

    if (!normalizedIngredientes.length) return;

    // Atualização local imediata (otimista)
    updateState((previous) => {
      const nextFichas = { ...previous.fichasByPrato };
      if (pratoOriginal && pratoOriginal !== normalizedPratoName) {
        delete nextFichas[pratoOriginal];
      }
      nextFichas[normalizedPratoName] = normalizedIngredientes;

      const nextDemandsByDay = Object.entries(previous.demandsByDay).reduce((accumulator, [dayId, rows]) => {
        accumulator[dayId] = rows.map((row) => {
          if (pratoOriginal && row.prato === pratoOriginal) {
            return { ...row, prato: normalizedPratoName };
          }
          return row;
        });
        return accumulator;
      }, {});

      const nextPratos = previous.pratos.some((dish) => dish.nome === normalizedPratoName)
        ? previous.pratos
        : [
            ...previous.pratos,
            {
              id: `dish-${Date.now()}`,
              nome: normalizedPratoName,
              categoria: 'Pratos',
              descricao: `Descricao de ${normalizedPratoName}`,
              tempo: '20 min',
              rating: '4.7',
              venda: 'R$ 0,00',
              custo: 'R$ 0,00',
              margem: '0%',
              imagem: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=420&fit=crop',
              ativo: true,
            },
          ];

      return {
        ...previous,
        pratos: nextPratos,
        fichasByPrato: nextFichas,
        demandsByDay: nextDemandsByDay,
      };
    });

    // Sincronização assíncrona com o backend
    (async () => {
      try {
        // Garantir que o prato exista no backend
        let pratoEntry = flowState.pratos.find((p) => p.nome === normalizedPratoName);
        let pratoId = pratoEntry?.id;

        if (!pratoId) {
          const created = await pratoService.criarPrato({
            nome: normalizedPratoName,
            categoria: 'PRATO_PRINCIPAL',
            descricao: `Ficha técnica de ${normalizedPratoName}`,
            tempoPreparo: 20,
            porcoes: 1,
            precoVenda: 0,
          });

          pratoId = created.id;
          // Atualizar id local do prato criado
          updateState((previous) => ({
            ...previous,
            pratos: previous.pratos.map((d) => (d.nome === normalizedPratoName ? mapPratoResponseToFlowPrato(created) : d)),
          }));
        }

        if (!pratoId) return;

        // Carregar fichas atuais do backend
        const existing = await pratoService.listarFichaTecnica(pratoId);
        const existingMap = new Map((existing || []).map((i) => [i.ingredienteNome?.toLowerCase(), i]));

        for (const item of normalizedIngredientes) {
          // Preparar payload conforme DTO do backend (KG)
          const payload = {
            ingredienteId: null,
            qtdPorPorcao: (Number(item.gramasPorPorcao) || 0) / 1000,
            unidade: 'KG',
            fatorCorrecao: 1.0,
            observacoes: '',
          };

          // Buscar ingrediente por nome
          try {
            const search = await ingredienteService.searchIngredientes(item.ingrediente);
            let found = (search && search.content && search.content[0]) || (Array.isArray(search) && search[0]);

            if (!found) {
              try {
                const created = await ingredienteService.createIngrediente({
                  nome: item.ingrediente,
                  descricao: `Ingrediente criado automaticamente para a ficha técnica de ${normalizedPratoName}`,
                  unidadeMedida: 'KG',
                  custoUnitario: item.custoPorKg || 0.01,
                  fornecedor: 'Gerado automaticamente',
                  categoriaRisco: 'MEDIO',
                  codigoInterno: `AUTO-${Date.now()}`,
                });
                found = created;
              } catch (createError) {
                console.warn('Falha ao criar ingrediente na sincronização de ficha:', item.ingrediente, createError);
              }
            }

            if (found) payload.ingredienteId = found.id || found.ingredienteId;
          } catch (ie) {
            // não encontrou ingrediente; pular esse item
            console.warn('Ingrediente não encontrado ao sincronizar ficha:', item.ingrediente, ie);
            continue;
          }

          const existingItem = existingMap.get(item.ingrediente.toLowerCase());

          try {
            if (existingItem && existingItem.id) {
              await pratoService.atualizarIngredienteFicha(pratoId, existingItem.id, payload);
            } else {
              await pratoService.adicionarIngredienteFicha(pratoId, payload);
            }
          } catch (err) {
            console.error('Erro ao sincronizar item de ficha:', err);
          }
        }

        // Recarregar fichas do backend e atualizar estado
        const refreshed = await pratoService.listarFichaTecnica(pratoId);
        const fichasNorm = (refreshed || []).map((item) => ({
          id: item.id,
          ingrediente: item.ingredienteNome,
          gramasPorPorcao: (Number(item.qtdPorPorcao) || 0) * 1000,
          custoPorKg: Number(item.custoUnitarioIngrediente) || 0,
        }));

        updateState((previous) => ({
          ...previous,
          fichasByPrato: {
            ...previous.fichasByPrato,
            [normalizedPratoName]: fichasNorm,
          },
        }));
      } catch (e) {
        console.error('Erro ao sincronizar fichas com backend:', e);
      }
    })();
  }, [updateState, flowState.pratos]);

  const deleteFicha = useCallback((pratoName) => {
    // Atualização local imediata
    updateState((previous) => {
      const nextFichas = { ...previous.fichasByPrato };
      delete nextFichas[pratoName];

      return {
        ...previous,
        fichasByPrato: nextFichas,
      };
    });

    // Sincronizar remoção com backend quando possível
    (async () => {
      try {
        const pratoEntry = flowState.pratos.find((p) => p.nome === pratoName);
        const pratoId = pratoEntry?.id;
        if (!pratoId) return;

        const existing = await pratoService.listarFichaTecnica(pratoId);
        for (const item of existing || []) {
          try {
            await pratoService.removerIngredienteFicha(pratoId, item.id);
          } catch (err) {
            console.error('Erro ao remover item de ficha no backend:', err);
          }
        }
      } catch (e) {
        console.error('Erro ao sincronizar remoção de ficha com backend:', e);
      }
    })();
  }, [updateState, flowState.pratos]);

  const setEstoqueValue = useCallback(async (ingredienteName, value) => {
    updateState((previous) => ({
      ...previous,
      estoque: {
        ...previous.estoque,
        [ingredienteName]: Number.isFinite(value) ? value : 0,
      },
    }));

    try {
      const ingredients = await ingredienteService.listIngredientes();
      const ingrediente = ingredients?.content?.find(i => i.nome.toLowerCase() === ingredienteName.toLowerCase());
      
      if (!ingrediente) {
        return;
      }

      const lotes = await estoqueService.getEstoqueByIngrediente(ingrediente.id);
      if (lotes && lotes.length > 0) {
        const firstLote = lotes[0];
        const currentVal = Number(firstLote.qtdDisponivel) || 0;
        const diff = value - currentVal;
        
        if (Math.abs(diff) > 0.001) {
          await estoqueService.registrarMovimento(firstLote.id, {
            tipo: 'AJUSTE',
            quantidade: Math.abs(diff),
            motivo: `Ajuste manual via tela de cálculo (${diff > 0 ? '+' : '-'}${Math.abs(diff)} kg)`
          });
        }
      } else {
        await estoqueService.addEstoque({
          ingredienteId: ingrediente.id,
          qtdDisponivel: value,
          qtdMinima: 5.0,
          lote: `LOTE-MANUAL-${Date.now()}`,
          localizacao: 'Geral'
        });
      }
    } catch (e) {
      console.error("Erro ao sincronizar valor do estoque no backend:", e);
    }
  }, [updateState]);

  const setSelectedDayId = useCallback((dayId) => {
    updateState((previous) => ({
      ...previous,
      calculation: {
        ...previous.calculation,
        selectedDayId: dayId,
      },
    }));
  }, [updateState]);

  const setMarginPercent = useCallback((percent) => {
    updateState((previous) => ({
      ...previous,
      calculation: {
        ...previous.calculation,
        marginPercent: Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 30) : 0,
      },
    }));
  }, [updateState]);

  const setProducaoStatus = useCallback(async (dayId, rowId, status) => {
    // Atualização local imediata
    updateState((previous) => ({
      ...previous,
      producaoStatusByDay: {
        ...previous.producaoStatusByDay,
        [dayId]: {
          ...(previous.producaoStatusByDay[dayId] || {}),
          [rowId]: status,
        },
      },
    }));

    // Sincronizar com o backend
    const rows = flowState.demandsByDay[dayId] || [];
    const targetRow = rows.find(r => r.id === rowId);

    if (targetRow && targetRow.demandaId) {
      try {
        if (status === 'Em preparo') {
          await demandaService.processarDemanda(targetRow.demandaId);
        } else if (status === 'Concluido') {
          await demandaService.finalizarDemanda(targetRow.demandaId);
        }
      } catch (error) {
        console.error("Erro ao atualizar status de produção no backend:", error);
      }
    }
  }, [flowState.demandsByDay, updateState]);

  const resetProducao = useCallback((dayId) => {
    updateState((previous) => {
      const rows = previous.demandsByDay[dayId] || [];
      const resetStatuses = rows.reduce((accumulator, row) => {
        accumulator[row.id] = 'Pendente';
        return accumulator;
      }, {});

      return {
        ...previous,
        producaoStatusByDay: {
          ...previous.producaoStatusByDay,
          [dayId]: resetStatuses,
        },
      };
    });
  }, [updateState]);

  const resetFlowData = useCallback(() => {
    const initial = buildInitialState();
    updateState(initial);
  }, [updateState]);

  const value = useMemo(() => ({
    pratos: flowState.pratos,
    dishNames: flowState.pratos.map((dish) => dish.nome),
    fichasByPrato: flowState.fichasByPrato,
    days,
    selectedDayId,
    demandsForSelectedDay,
    demandsByDay: flowState.demandsByDay,
    ingredientBreakdown,
    estoque: flowState.estoque,
    productionRows,
    marginPercent: flowState.calculation.marginPercent,
    addPrato,
    ensureDayExists,
    addDemand,
    updateDemand,
    deleteDemand,
    upsertFicha,
    deleteFicha,
    setEstoqueValue,
    setSelectedDayId,
    setMarginPercent,
    setProducaoStatus,
    resetProducao,
    resetFlowData,
  }), [
    flowState.pratos,
    flowState.fichasByPrato,
    flowState.demandsByDay,
    flowState.estoque,
    flowState.calculation.marginPercent,
    days,
    selectedDayId,
    demandsForSelectedDay,
    ingredientBreakdown,
    productionRows,
    addPrato,
    ensureDayExists,
    addDemand,
    updateDemand,
    deleteDemand,
    upsertFicha,
    deleteFicha,
    setEstoqueValue,
    setSelectedDayId,
    setMarginPercent,
    setProducaoStatus,
    resetProducao,
    resetFlowData,
  ]);

  return <OperationalFlowContext.Provider value={value}>{children}</OperationalFlowContext.Provider>;
}
