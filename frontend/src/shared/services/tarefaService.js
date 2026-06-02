import api from '../../services/api';

/**
 * Serviço para Tarefas
 */
export const tarefaService = {
  /**
   * Lista tarefas com filtro por status
   */
  async listTarefas(params = {}) {
    try {
      const response = await api.get('/tarefas', { params });
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      throw error;
    }
  },

  /**
   * Obtém detalhes de uma tarefa
   */
  async getTarefa(id) {
    try {
      const response = await api.get(`/tarefas/${id}`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao carregar tarefa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria nova tarefa
   */
  async createTarefa(data) {
    try {
      const response = await api.post('/tarefas', data);
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  },

  /**
   * Atualiza tarefa
   */
  async updateTarefa(id, data) {
    try {
      const response = await api.put(`/tarefas/${id}`, data);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao atualizar tarefa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Marca tarefa como concluída
   */
  async completeTarefa(id) {
    try {
      const response = await api.patch(`/tarefas/${id}/concluir`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao concluir tarefa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cancela tarefa
   */
  async cancelTarefa(id) {
    try {
      const response = await api.patch(`/tarefas/${id}/cancelar`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao cancelar tarefa ${id}:`, error);
      throw error;
    }
  },
};
