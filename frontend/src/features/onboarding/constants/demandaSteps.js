export const DEMANDA_TOUR_ID = 'demanda-main';

export const demandaSteps = [
  {
    id: 'demanda-header',
    title: 'Voce esta em Demanda',
    description: 'Demanda e o primeiro passo do sistema. Aqui voce define quantos pratos serao produzidos.',
  },
  {
    id: 'add-demanda',
    title: 'Adicionar demanda',
    selector: '[data-tour="add-demanda-button"]',
    advanceOnSelector: '[data-tour="add-demanda-modal"]',
    actionHint: 'Clique em Adicionar demanda para abrir o modal e continuar.',
    description: 'Clique neste botao para abrir o formulario. Voce escolhe prato, data e quantidade planejada, e o resultado aparece na tabela imediatamente.',
  },
  {
    id: 'flow-connection',
    title: 'Como as telas se conectam',
    description: 'Demanda alimenta o Calculo. Fichas Tecnicas tambem alimentam o Calculo com ingredientes por porcao.',
  },
  {
    id: 'week-selector',
    selector: '[data-tour="week-selector"]',
    title: 'Navegue entre os dias da semana',
    description: 'Use este seletor para navegar entre os dias. As datas sao geradas automaticamente a partir de hoje. Clique em um dia para visualizar a demanda correspondente.',
  },
  {
    id: 'demanda-legend',
    title: 'Como interpretar Previsto, Vendido e Resultado',
    description: 'Previsto e a quantidade planejada. Vendido e a quantidade vendida. Resultado negativo indica falta de producao; positivo pode sinalizar sobra.',
  },
  {
    id: 'demanda-table',
    selector: '[data-tour="demanda-table"]',
    title: 'Tabela de ajuste do dia',
    description: 'Edite Previsto e Vendido. O Resultado e calculado automaticamente para apoiar sua decisao.',
  },
  {
    id: 'go-to-fichas',
    selector: '[data-tour="go-to-fichas-button"]',
    title: 'Proximo: Siga para Fichas Tecnicas',
    description: 'Depois de ajustar a Demanda, avance para Fichas Tecnicas para garantir que cada prato tenha ingredientes e custos definidos.',
  },
];
