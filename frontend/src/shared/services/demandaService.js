import api from '../../services/api';

/**
 * Serviço para Demandas (Production Forecasting)
 */
export const demandaService = {
  /**
   * Lista demandas com paginação
   */
  async listDemandas(params = {}) {
    try {
      const response = await api.get('/demandas', { params });
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao listar demandas:', error);
      throw error;
    }
  },

  /**
   * Obtém detalhes de uma demanda específica
   */
  async getDemanda(id) {
    try {
      const response = await api.get(`/demandas/${id}`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao carregar demanda ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria nova demanda
   */
  async createDemanda(data) {
    try {
      const response = await api.post('/demandas', data);
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao criar demanda:', error);
      throw error;
    }
  },

  /**
   * Processa uma demanda (calcula ingredientes, verifica estoque, gera compras)
   */
  async processarDemanda(id) {
    try {
      const response = await api.post(`/demandas/${id}/processar`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao processar demanda ${id}:`, error);
      throw error;
    }
  },

  /**
   * Finaliza uma demanda
   */
  async finalizarDemanda(id) {
    try {
      const response = await api.post(`/demandas/${id}/finalizar`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao finalizar demanda ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cancela uma demanda
   */
  async cancelarDemanda(id) {
    try {
      const response = await api.post(`/demandas/${id}/cancelar`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao cancelar demanda ${id}:`, error);
      throw error;
    }
  },
};
