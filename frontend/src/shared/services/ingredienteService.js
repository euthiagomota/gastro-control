import api from '../../services/api';

/**
 * Serviço para Ingredientes
 */
export const ingredienteService = {
  /**
   * Lista ingredientes com paginação
   */
  async listIngredientes(params = {}) {
    try {
      const response = await api.get('/ingredientes', { params });
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao listar ingredientes:', error);
      throw error;
    }
  },

  /**
   * Obtém detalhes de um ingrediente específico
   */
  async getIngrediente(id) {
    try {
      const response = await api.get(`/ingredientes/${id}`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao carregar ingrediente ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca ingredientes por nome (fulltext search)
   */
  async searchIngredientes(nome) {
    try {
      const response = await api.get('/ingredientes/buscar', {
        params: { nome },
      });
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      throw error;
    }
  },

  /**
   * Cria novo ingrediente (ADMIN only)
   */
  async createIngrediente(data) {
    try {
      const response = await api.post('/ingredientes', data);
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao criar ingrediente:', error);
      throw error;
    }
  },

  /**
   * Atualiza ingrediente (ADMIN only)
   */
  async updateIngrediente(id, data) {
    try {
      const response = await api.put(`/ingredientes/${id}`, data);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao atualizar ingrediente ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deleta ingrediente (ADMIN only)
   */
  async deleteIngrediente(id) {
    try {
      const response = await api.delete(`/ingredientes/${id}`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao deletar ingrediente ${id}:`, error);
      throw error;
    }
  },

  /**
   * Ativa ingrediente (ADMIN only)
   */
  async activateIngrediente(id) {
    try {
      const response = await api.patch(`/ingredientes/${id}/ativar`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao ativar ingrediente ${id}:`, error);
      throw error;
    }
  },

  /**
   * Desativa ingrediente (ADMIN only)
   */
  async deactivateIngrediente(id) {
    try {
      const response = await api.patch(`/ingredientes/${id}/inativar`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao desativar ingrediente ${id}:`, error);
      throw error;
    }
  },
};
