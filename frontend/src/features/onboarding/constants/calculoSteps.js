export const CALCULO_TOUR_ID = 'calculo-main';

export const calculoSteps = [
  {
    id: 'calculo-header',
    title: 'Voce esta em Calculo',
    description: 'Esta e a tela central do sistema. Aqui a Demanda + Fichas Tecnicas = ingredientes necessarios para producao.',
  },
  {
    id: 'calculo-formula',
    selector: '[data-tour="calculo-formula"]',
    title: 'Como funciona o calculo',
    description: 'O sistema multiplica a quantidade de pratos (Demanda) pelas quantidades por porcao (Fichas). O resultado e a quantidade total de cada ingrediente necessaria.',
  },
  {
    id: 'calculo-day-selector',
    selector: '[data-tour="calculo-day-selector"]',
    title: 'Selecione o dia',
    description: 'Use este seletor para escolher qual dia voce quer planejar. A necessidade de ingredientes muda conforme a demanda do dia.',
  },
  {
    id: 'calculo-breakdown',
    selector: '[data-tour="calculo-breakdown"]',
    title: 'Necesario vs Disponivel',
    description: 'Aqui voce ve quanto ingrediente e necessario (calculado automaticamente) e quanto esta disponivel. Voce pode ajustar a disponibilidade se necessario.',
  },
  {
    id: 'calculo-edit-available',
    selector: '[data-tour="calculo-editavel"]',
    title: 'Ajustar disponibilidade',
    description: 'Edite o campo Disponivel de cada ingrediente para simular cenarios reais de estoque. O saldo e a acao sao recalculados na hora.',
  },
  {
    id: 'calculo-go-to-estoque',
    selector: '[data-tour="calculo-go-to-estoque-button"]',
    title: 'Proximo: Ir para Estoque',
    description: 'Apos revisar o calculo, va para Estoque para confirmar a disponibilidade e ajustar faltas.',
  },
];
