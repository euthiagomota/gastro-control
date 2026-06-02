import api from './api';

/**
 * Serviço para operações com pratos e fichas técnicas
 */
export const pratoService = {
  /**
   * Lista todos os pratos
   */
  async listarPratos(pageable = { page: 0, size: 100 }) {
    try {
      const response = await api.get('/pratos', { params: pageable });
      return response.data.dados?.content || [];
    } catch (error) {
      console.error('Erro ao listar pratos:', error);
      return [];
    }
  },

  /**
   * Busca prato por ID
   */
  async buscarPratoPorId(id) {
    try {
      const response = await api.get(`/pratos/${id}`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao buscar prato ${id}:`, error);
      return null;
    }
  },

  /**
   * Lista fichas técnicas de um prato
   */
  async listarFichaTecnica(pratoId) {
    try {
      const response = await api.get(`/pratos/${pratoId}/ficha-tecnica`);
      return response.data.dados || [];
    } catch (error) {
      console.error(`Erro ao listar ficha técnica do prato ${pratoId}:`, error);
      return [];
    }
  },

  /**
   * Cria um novo prato
   */
  async criarPrato(data) {
    try {
      const response = await api.post('/pratos', data);
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao criar prato:', error);
      throw error;
    }
  },

  /**
   * Adiciona ingrediente à ficha técnica
   */
  async adicionarIngredienteFicha(pratoId, data) {
    try {
      const response = await api.post(`/pratos/${pratoId}/ficha-tecnica`, data);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao adicionar ingrediente ao prato ${pratoId}:`, error);
      throw error;
    }
  },

  /**
   * Atualiza ingrediente da ficha técnica
   */
  async atualizarIngredienteFicha(pratoId, fichaId, data) {
    try {
      const response = await api.put(`/pratos/${pratoId}/ficha-tecnica/${fichaId}`, data);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao atualizar ingrediente ${fichaId} do prato ${pratoId}:`, error);
      throw error;
    }
  },

  /**
   * Remove ingrediente da ficha técnica
   */
  async removerIngredienteFicha(pratoId, fichaId) {
    try {
      await api.delete(`/pratos/${pratoId}/ficha-tecnica/${fichaId}`);
      return true;
    } catch (error) {
      console.error(`Erro ao remover ingrediente ${fichaId} do prato ${pratoId}:`, error);
      throw error;
    }
  },
};

export default pratoService;
