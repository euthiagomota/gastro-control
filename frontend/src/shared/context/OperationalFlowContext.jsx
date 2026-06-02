import { useCallback, useMemo, useState } from 'react';
import OperationalFlowContext from './OperationalFlowContextValue';
import {
  BASE_DEMAND_DISHES,
  ESTOQUE_DISPONIVEL,
  FICHAS_TECNICAS,
  buildDefaultDemandRows,
  buildIngredientBreakdown,
  calculateResultado,
} from '../../features/mvp-flow/data/operationalFlow';
import { getUpcomingWeek } from '../utils/date';

const FLOW_STORAGE_KEY = 'gastrocontrol:operational-flow:v1';
const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

const DEFAULT_DISH_DETAILS = {
  'Marmita Fitness': {
    categoria: 'Marmitas',
    descricao: 'Frango grelhado, arroz integral, legumes no vapor e salada.',
    tempo: '20 min',
    rating: '4.8',
    venda: 'R$ 22,90',
    custo: 'R$ 9,40',
    margem: '59%',
    imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=420&fit=crop',
  },
  'Smash Burguer': {
    categoria: 'Lanches',
    descricao: 'Blend de frango e boi, queijo cheddar, alface e tomate.',
    tempo: '15 min',
    rating: '4.8',
    venda: 'R$ 34,90',
    custo: 'R$ 12,80',
    margem: '63%',
    imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=420&fit=crop',
  },
};

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

function buildDefaultPratos() {
  return BASE_DEMAND_DISHES.map((dish) => {
    const details = DEFAULT_DISH_DETAILS[dish.prato];

    return {
      id: `dish-${dish.id}`,
      nome: dish.prato,
      categoria: details?.categoria || 'Pratos',
      descricao: details?.descricao || `Descricao de ${dish.prato}`,
      tempo: details?.tempo || '20 min',
      rating: details?.rating || '4.7',
      venda: details?.venda || 'R$ 0,00',
      custo: details?.custo || 'R$ 0,00',
      margem: details?.margem || '0%',
      imagem: details?.imagem || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=420&fit=crop',
      ativo: true,
    };
  });
}

function buildDefaultFichas() {
  return Object.entries(FICHAS_TECNICAS).reduce((accumulator, [prato, ingredientes]) => {
    accumulator[prato] = ingredientes.map((item) => ({
      id: `${prato}-${item.ingrediente}`,
      ingrediente: item.ingrediente,
      gramasPorPorcao: item.gramasPorPorcao,
      custoPorKg: item.custoPorKg,
    }));
    return accumulator;
  }, {});
}

function buildDefaultDaysAndDemands() {
  const days = getUpcomingWeek(new Date(), 7).map((day) => ({
    id: toDateKey(day.date),
    dateISO: day.date.toISOString(),
  }));

  const demandsByDay = days.reduce((accumulator, day, index) => {
    accumulator[day.id] = buildDefaultDemandRows(index).map((row) => normalizeDemandRow({
      ...row,
      id: `${row.id}-${day.id}`,
      eventoEspecial: 'Nao',
      observacao: '',
    }));
    return accumulator;
  }, {});

  return { days, demandsByDay };
}

function buildInitialState() {
  const { days, demandsByDay } = buildDefaultDaysAndDemands();

  return {
    pratos: buildDefaultPratos(),
    fichasByPrato: buildDefaultFichas(),
    days,
    demandsByDay,
    estoque: { ...ESTOQUE_DISPONIVEL },
    producaoStatusByDay: {},
    calculation: {
      selectedDayId: days[0]?.id || null,
      marginPercent: 5,
    },
  };
}

function normalizeHydratedState(state) {
  const fallback = buildInitialState();

  return {
    ...fallback,
    ...state,
    pratos: state?.pratos?.length ? state.pratos : fallback.pratos,
    fichasByPrato: state?.fichasByPrato || fallback.fichasByPrato,
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

  const addPrato = useCallback((payload) => {
    updateState((previous) => {
      const nome = payload.nome?.trim();
      if (!nome) return previous;

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
    let createdRow = null;

    updateState((previous) => {
      const previsto = Number(payload.previsto);
      if (!dateKey || !payload.prato || !Number.isFinite(previsto) || previsto <= 0) {
        return previous;
      }

      const row = normalizeDemandRow({
        id: `demand-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        prato: payload.prato,
        previsto,
        vendido: null,
        eventoEspecial: payload.eventoEspecial || 'Nao',
        observacao: payload.observacao || '',
      });

      createdRow = row;

      return {
        ...previous,
        calculation: {
          ...previous.calculation,
          selectedDayId: dateKey,
        },
        demandsByDay: {
          ...previous.demandsByDay,
          [dateKey]: [row, ...(previous.demandsByDay[dateKey] || [])],
        },
      };
    });

    return createdRow;
  }, [updateState]);

  const updateDemand = useCallback((dayId, rowId, patch) => {
    updateState((previous) => {
      const rows = previous.demandsByDay[dayId] || [];

      return {
        ...previous,
        demandsByDay: {
          ...previous.demandsByDay,
          [dayId]: rows.map((row) => {
            if (row.id !== rowId) return row;

            const nextPrevisto = patch.previsto !== undefined ? Number(patch.previsto) : row.previsto;
            const nextVendido = patch.vendido !== undefined
              ? (patch.vendido === '' || patch.vendido === null ? null : Number(patch.vendido))
              : row.vendido;

            return normalizeDemandRow({
              ...row,
              ...patch,
              previsto: Number.isFinite(nextPrevisto) ? nextPrevisto : row.previsto,
              vendido: nextVendido,
            });
          }),
        },
      };
    });
  }, [updateState]);

  const deleteDemand = useCallback((dayId, rowId) => {
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
  }, [updateState]);

  const upsertFicha = useCallback((pratoOriginal, pratoName, ingredientes) => {
    updateState((previous) => {
      const normalizedPratoName = pratoName?.trim();
      if (!normalizedPratoName) return previous;

      const normalizedIngredientes = ingredientes
        .filter((item) => item.ingrediente?.trim())
        .map((item) => ({
          id: item.id || `${normalizedPratoName}-${item.ingrediente}-${Date.now()}`,
          ingrediente: item.ingrediente.trim(),
          gramasPorPorcao: Number(item.gramasPorPorcao) || 0,
          custoPorKg: Number(item.custoPorKg) || 0,
        }));

      if (!normalizedIngredientes.length) {
        return previous;
      }

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
  }, [updateState]);

  const deleteFicha = useCallback((pratoName) => {
    updateState((previous) => {
      const nextFichas = { ...previous.fichasByPrato };
      delete nextFichas[pratoName];

      return {
        ...previous,
        fichasByPrato: nextFichas,
      };
    });
  }, [updateState]);

  const setEstoqueValue = useCallback((ingrediente, value) => {
    updateState((previous) => ({
      ...previous,
      estoque: {
        ...previous.estoque,
        [ingrediente]: Number.isFinite(value) ? value : 0,
      },
    }));
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

  const setProducaoStatus = useCallback((dayId, rowId, status) => {
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
  }, [updateState]);

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
