export const FICHA_MAIN_TOUR_ID = 'ficha-main';
export const FICHA_MODAL_TOUR_ID = 'ficha-modal';

export const fichaMainSteps = [
  {
    id: 'ficha-header',
    title: 'Voce esta em Fichas Tecnicas',
    description: 'Aqui voce define os ingredientes que compoe cada prato e suas quantidades por porcao.',
  },
  {
    id: 'ficha-units-info',
    title: 'Entenda as unidades',
    description: 'Quantidade sempre em gramas (g). Custo sempre em R$ por quilograma (R$/kg). Voce pode editar, adicionar e remover fichas a qualquer momento.',
  },
  {
    id: 'ficha-new-button',
    title: 'Criar nova ficha',
    selector: '[data-tour="ficha-new-button"]',
    spotlightClicks: true,
    advanceOnSelector: '[data-tour="ficha-new-modal"]',
    actionHint: 'Clique em Nova ficha para abrir o modal e comecar a cadastrar.',
    description: 'Use este botao para criar uma ficha tecnica para um novo prato. Voce informara ingredientes, quantidades e custos.',
  },
  {
    id: 'ficha-search',
    selector: '[data-tour="ficha-search"]',
    title: 'Buscar fichas existentes',
    description: 'Use esta barra para procurar por pratos ja cadastrados. Voce pode editar ou excluir qualquer ficha.',
  },
  {
    id: 'ficha-cards',
    title: 'Ver e gerenciar fichas',
    description: 'Cada card mostra os ingredientes de um prato com seus custos. Use os botoes Editar ou Excluir conforme necessario.',
  },
  {
    id: 'ficha-go-to-calculo',
    selector: '[data-tour="ficha-go-to-calculo-button"]',
    title: 'Proximo: Ir para Calculo',
    description: 'Apos definir todas as fichas, clique aqui para ir para Calculo e ver como os ingredientes sao necessarios.',
  },
];

export const fichaModalSteps = [
  {
    id: 'ficha-modal-opened',
    selector: '[data-tour="ficha-new-modal"]',
    title: 'Modal da nova ficha aberto',
    description: 'Agora voce esta no contexto de cadastro. Os proximos passos mudam para os campos desse modal.',
  },
  {
    id: 'ficha-modal-prato',
    selector: '[data-tour="ficha-modal-prato"]',
    title: 'Selecione o prato',
    description: 'Escolha o prato para esta ficha tecnica. Se necessario, selecione Outro para cadastrar um nome personalizado.',
  },
  {
    id: 'ficha-modal-ingredientes',
    selector: '[data-tour="ficha-modal-ingredients"]',
    title: 'Defina os ingredientes',
    description: 'Informe ingrediente, quantidade em gramas e custo em R$/kg para cada item.',
  },
  {
    id: 'ficha-modal-submit',
    selector: '[data-tour="ficha-modal-submit"]',
    title: 'Salvar ou fechar modal',
    description: 'Clique em Criar ficha para salvar. Se fechar o modal, o tutorial volta automaticamente para os passos da tela principal.',
  },
];
