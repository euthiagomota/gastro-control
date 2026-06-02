export const PRODUCAO_TOUR_ID = 'producao-main';

export const producaoSteps = [
  {
    id: 'producao-header',
    title: 'Voce esta em Producao',
    description: 'Esta e a tela final. Aqui voce executa o plano de producao com base no Calculo + Estoque.',
  },
  {
    id: 'producao-day-selector',
    selector: '[data-tour="producao-day-selector"]',
    title: 'Selecione o dia da producao',
    description: 'Escolha qual dia voce vai executar a producao. Os ingredientes ja foram validados no Estoque.',
  },
  {
    id: 'producao-plan',
    selector: '[data-tour="producao-plan"]',
    title: 'Veja o plano de producao',
    description: 'O plano mostra cada prato, quantidade prevista, ingredientes necessarios e status. Execute conforme indicado.',
  },
  {
    id: 'producao-summary',
    selector: '[data-tour="producao-summary"]',
    title: 'Resumo executivo',
    description: 'Um resumo rapido da producao do dia: total de pratos, ingredientes utilizados, tempo estimado.',
  },
  {
    id: 'producao-final',
    title: 'Producao concluida',
    description: 'Apos executar todos os pratos, marque como concluido. Voce pode revisitar o Guia ou recomcar o fluxo.',
  },
];
