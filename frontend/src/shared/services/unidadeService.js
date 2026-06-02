import api from '../../services/api';

/**
 * Serviço para Unidades
 */
export const unidadeService = {
  /**
   * Lista todas as unidades
   */
  async listUnidades(params = {}) {
    try {
      const response = await api.get('/unidades', { params });
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao listar unidades:', error);
      throw error;
    }
  },

  /**
   * Obtém detalhes de uma unidade
   */
  async getUnidade(id) {
    try {
      const response = await api.get(`/unidades/${id}`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao carregar unidade ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria nova unidade
   */
  async createUnidade(data) {
    try {
      const response = await api.post('/unidades', data);
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao criar unidade:', error);
      throw error;
    }
  },

  /**
   * Atualiza unidade
   */
  async updateUnidade(id, data) {
    try {
      const response = await api.put(`/unidades/${id}`, data);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao atualizar unidade ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtém funcionários de uma unidade
   */
  async getUnidadeFuncionarios(unidadeId) {
    try {
      const response = await api.get(`/unidades/${unidadeId}/funcionarios`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao carregar funcionários da unidade ${unidadeId}:`, error);
      throw error;
    }
  },
};
