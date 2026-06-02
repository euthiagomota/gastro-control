export const BASE_DEMAND_DISHES = [
  { id: 1, prato: 'Marmita Fitness', previstoBase: 42 },
  { id: 2, prato: 'Smash Burguer', previstoBase: 28 },
  { id: 3, prato: 'Frango Caipira', previstoBase: 15 },
  { id: 4, prato: 'Massa Caseira', previstoBase: 20 },
  { id: 5, prato: 'Acai Gourmet', previstoBase: 35 },
];

export const FICHAS_TECNICAS = {
  'Marmita Fitness': [
    { ingrediente: 'Frango', gramasPorPorcao: 150, custoPorKg: 24.0 },
    { ingrediente: 'Arroz', gramasPorPorcao: 120, custoPorKg: 8.5 },
    { ingrediente: 'Legumes', gramasPorPorcao: 80, custoPorKg: 11.0 },
  ],
  'Smash Burguer': [
    { ingrediente: 'Blend de carne', gramasPorPorcao: 140, custoPorKg: 28.0 },
    { ingrediente: 'Pao', gramasPorPorcao: 70, custoPorKg: 13.0 },
    { ingrediente: 'Queijo', gramasPorPorcao: 30, custoPorKg: 32.0 },
  ],
  'Frango Caipira': [
    { ingrediente: 'Frango', gramasPorPorcao: 300, custoPorKg: 24.0 },
    { ingrediente: 'Tempero', gramasPorPorcao: 20, custoPorKg: 18.0 },
  ],
  'Massa Caseira': [
    { ingrediente: 'Massa', gramasPorPorcao: 190, custoPorKg: 10.0 },
    { ingrediente: 'Molho', gramasPorPorcao: 100, custoPorKg: 15.0 },
    { ingrediente: 'Queijo', gramasPorPorcao: 30, custoPorKg: 32.0 },
  ],
  'Acai Gourmet': [
    { ingrediente: 'Acai', gramasPorPorcao: 250, custoPorKg: 19.0 },
    { ingrediente: 'Toppings', gramasPorPorcao: 50, custoPorKg: 26.0 },
  ],
};

export const ESTOQUE_DISPONIVEL = {
  Frango: 8.2,
  Arroz: 11.5,
  Legumes: 5.4,
  'Blend de carne': 3.5,
  Pao: 3.2,
  Queijo: 2.1,
  Tempero: 0.9,
  Massa: 4.0,
  Molho: 2.6,
  Acai: 6.0,
  Toppings: 1.5,
};

export function buildDefaultDemandRows(dayIndex = 0) {
  return BASE_DEMAND_DISHES.map((dish, rowIndex) => {
    const offset = ((dayIndex + rowIndex) % 4) - 1;
    const previsto = Math.max(1, dish.previstoBase + offset);
    const hasVendido = (dayIndex + rowIndex) % 3 !== 0;
    const vendidoOffset = ((dayIndex * 2 + rowIndex) % 5) - 2;
    const vendido = hasVendido ? Math.max(0, previsto + vendidoOffset) : null;

    return {
      id: `${dish.id}-${dayIndex}`,
      prato: dish.prato,
      previsto,
      vendido,
    };
  });
}

export function calculateResultado(previsto, vendido) {
  if (vendido === null || vendido === undefined || vendido === '') {
    return { resultado: null, status: 'Aguardando vendas' };
  }

  const resultado = vendido - previsto;
  if (resultado > 0) return { resultado, status: 'Sobrou' };
  if (resultado < 0) return { resultado, status: 'Faltou' };
  return { resultado: 0, status: 'Dentro do previsto' };
}

export function buildIngredientBreakdown(
  demandRows,
  marginPercent = 0,
  fichasTecnicas = FICHAS_TECNICAS,
  estoqueDisponivel = ESTOQUE_DISPONIVEL
) {
  const ingredientsMap = new Map();

  demandRows.forEach((row) => {
    const ficha = fichasTecnicas[row.prato] || [];

    ficha.forEach((item) => {
      const quantidadeKg = (item.gramasPorPorcao * row.previsto) / 1000;

      if (!ingredientsMap.has(item.ingrediente)) {
        ingredientsMap.set(item.ingrediente, {
          ingrediente: item.ingrediente,
          linhas: [],
          baseKg: 0,
          custoTotal: 0,
        });
      }

      const current = ingredientsMap.get(item.ingrediente);
      current.linhas.push({
        prato: row.prato,
        previsto: row.previsto,
        gramasPorPorcao: item.gramasPorPorcao,
        quantidadeKg,
      });
      current.baseKg += quantidadeKg;
      current.custoTotal += quantidadeKg * item.custoPorKg;
    });
  });

  return Array.from(ingredientsMap.values()).map((ingredient) => {
    const margemKg = ingredient.baseKg * (marginPercent / 100);
    const necessarioKg = ingredient.baseKg + margemKg;
    const disponivelKg = estoqueDisponivel[ingredient.ingrediente] ?? 0;

    return {
      ...ingredient,
      baseKg: Number(ingredient.baseKg.toFixed(2)),
      margemKg: Number(margemKg.toFixed(2)),
      necessarioKg: Number(necessarioKg.toFixed(2)),
      disponivelKg: Number(disponivelKg.toFixed(2)),
      saldoKg: Number((disponivelKg - necessarioKg).toFixed(2)),
      custoTotal: Number(ingredient.custoTotal.toFixed(2)),
    };
  });
}
