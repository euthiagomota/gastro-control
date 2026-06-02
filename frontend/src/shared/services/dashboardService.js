import api from '../../services/api';

/**
 * Serviço para Dashboard - KPIs e métricas
 */
export const dashboardService = {
  /**
   * Obtém KPIs e métricas do dashboard
   */
  async getDashboard() {
    try {
      const response = await api.get('/dashboard');
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      throw error;
    }
  },
};
