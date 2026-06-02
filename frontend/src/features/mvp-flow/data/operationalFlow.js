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
  fichasTecnicas = {},
  estoqueDisponivel = {}
) {
  const ingredientsMap = new Map();

  if (!Array.isArray(demandRows) || demandRows.length === 0) return [];

  demandRows.forEach((row) => {
    const ficha = fichasTecnicas[row.prato] || [];

    ficha.forEach((item) => {
      const gramas = Number(item.gramasPorPorcao) || 0;
      const quantidadeKg = (gramas * Number(row.previsto || 0)) / 1000;

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
        previsto: Number(row.previsto) || 0,
        gramasPorPorcao: gramas,
        quantidadeKg,
      });
      current.baseKg += quantidadeKg;
      current.custoTotal += quantidadeKg * (Number(item.custoPorKg) || 0);
    });
  });

  return Array.from(ingredientsMap.values()).map((ingredient) => {
    const margemKg = ingredient.baseKg * (marginPercent / 100);
    const necessarioKg = ingredient.baseKg + margemKg;
    const disponivelKg = Number(estoqueDisponivel[ingredient.ingrediente] || 0);

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
