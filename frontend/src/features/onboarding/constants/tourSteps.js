import { DEMANDA_TOUR_ID } from './demandaSteps';

// Mapeia rotas para seu tour ID e passos
export const toursByRoute = {
  '/admin/demanda': {
    tourId: DEMANDA_TOUR_ID,
    pageTitle: 'Demanda',
  },
  '/admin/fichas-tecnicas': {
    tourId: 'ficha-main',
    pageTitle: 'Fichas Tecnicas',
  },
  '/admin/calculo': {
    tourId: 'calculo-main',
    pageTitle: 'Calculo',
  },
  '/admin/estoque': {
    tourId: 'estoque-main',
    pageTitle: 'Estoque',
  },
  '/admin/producao': {
    tourId: 'producao-main',
    pageTitle: 'Producao',
  },
};
