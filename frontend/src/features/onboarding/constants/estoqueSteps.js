export const ESTOQUE_TOUR_ID = 'estoque-main';

export const estoqueSteps = [
  {
    id: 'estoque-header',
    title: 'Voce esta em Estoque',
    description: 'Esta tela lista ingredientes necessarios vs o que voce tem disponivel. Ajuste faltas antes da producao.',
  },
  {
    id: 'estoque-day-selector',
    selector: '[data-tour="estoque-day-selector"]',
    title: 'Escolha o dia da producao',
    description: 'Selecione o dia para ver quais ingredientes serao necessarios. O sistema alerta se faltar algo.',
  },
  {
    id: 'estoque-status',
    selector: '[data-tour="estoque-status"]',
    title: 'Veja o status dos ingredientes',
    description: 'Verde = ja tem o suficiente. Vermelho = falta. Revise os valores e corrija na tela de Calculo se necessario.',
  },
  {
    id: 'estoque-summary',
    title: 'Resumo da situacao',
    description: 'Um resumo rapido mostra quantos ingredientes estao ok e quantos precisam de ajuste.',
  },
  {
    id: 'estoque-go-to-producao',
    selector: '[data-tour="estoque-go-to-producao-button"]',
    title: 'Proximo: Executar a Producao',
    description: 'Se tudo esta ok no Estoque, va para Producao e execute o plano final.',
  },
];
