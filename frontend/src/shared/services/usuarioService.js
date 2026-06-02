import api from '../../services/api';

/**
 * Serviço para Usuários (Colaboradores/Funcionários)
 */
export const usuarioService = {
  /**
   * Obtém dados do usuário logado
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/usuarios/me');
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao carregar usuário logado:', error);
      throw error;
    }
  },

  /**
   * Obtém detalhes de um usuário específico
   */
  async getUsuario(id) {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao carregar usuário ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lista usuários com filtro por role
   */
  async listUsuarios(params = {}) {
    try {
      const response = await api.get('/usuarios', { params });
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  },

  /**
   * Cria novo usuário
   */
  async createUsuario(data) {
    try {
      const response = await api.post('/usuarios', data);
      return response.data.dados;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  /**
   * Atualiza dados de um usuário
   */
  async updateUsuario(id, data) {
    try {
      const response = await api.put(`/usuarios/${id}`, data);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao atualizar usuário ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtém estatísticas de um usuário
   */
  async getUserStats(id) {
    try {
      const response = await api.get(`/usuarios/${id}/stats`);
      return response.data.dados;
    } catch (error) {
      console.error(`Erro ao carregar stats do usuário ${id}:`, error);
      throw error;
    }
  },
};
