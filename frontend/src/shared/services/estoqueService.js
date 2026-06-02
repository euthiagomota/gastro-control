import api from '../../services/api';

/**
 * Serviço para Estoque (Inventário com FEFO)
 */
export const estoqueService = {
  /**
   * Lista estoque com paginação
   */
  async listEstoque(params = {}) {
    try {
      const response = await api.get('/estoque', { params });
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao listar estoque:', error);
      throw error;
    }
  },

  /**
   * Obtém detalhes de um lote específico
   */
  async getEstoque(id) {
    try {
      const response = await api.get(`/estoque/${id}`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao carregar estoque ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtém todos os lotes de um ingrediente específico
   */
  async getEstoqueByIngrediente(ingredienteId) {
    try {
      const response = await api.get(`/estoque/ingrediente/${ingredienteId}`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao listar estoque do ingrediente ${ingredienteId}:`, error);
      throw error;
    }
  },

  /**
   * Adiciona novo lote ao estoque
   */
  async addEstoque(data) {
    try {
      const response = await api.post('/estoque', data);
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao adicionar estoque:', error);
      throw error;
    }
  },

  /**
   * Registra movimentação de estoque
   */
  async addMovimentacao(estoqueId, data) {
    try {
      const response = await api.post(`/estoque/${estoqueId}/movimentacao`, data);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao registrar movimentação do estoque ${estoqueId}:`, error);
      throw error;
    }
  },

  /**
   * Obtém alertas de estoque baixo
   */
  async getAlertasEstoqueBaixo() {
    try {
      const response = await api.get('/estoque/alertas/estoque-baixo');
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao carregar alertas de estoque baixo:', error);
      throw error;
    }
  },

  /**
   * Obtém alertas de vencimento
   */
  async getAlertasVencimento(diasAvance = 7) {
    try {
      const response = await api.get('/estoque/alertas/vencimento', {
        params: { diasAvance },
      });
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao carregar alertas de vencimento:', error);
      throw error;
    }
  },
};
