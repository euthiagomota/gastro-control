import api from './api';

/**
 * Serviço para operações de autenticação
 */
export const authService = {
  /**
   * Realiza login do usuário
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   */
  async login(email, senha) {
    try {
      if (!email || !senha) {
        throw new Error('Email e senha são obrigatórios');
      }

      const payload = {
        email: email.trim(),
        senha,
      };

      const response = await api.post('/auth/login', payload);

      if (!response.data?.dados) {
        throw new Error('Resposta inválida do servidor');
      }

      const dados = response.data.dados;

      const usuario = {
        id: dados.usuarioId,
        nome: dados.nome,
        email: dados.email,
        role: dados.role,
      };

      if (!dados.accessToken) {
        throw new Error('Token não recebido');
      }

      localStorage.setItem(
        'gastrocontrol:auth:token',
        dados.accessToken
      );

      localStorage.setItem(
        'gastrocontrol:auth:refreshToken',
        dados.refreshToken
      );

      localStorage.setItem(
        'gastrocontrol:auth:user',
        JSON.stringify(usuario)
      );

      return {
        accessToken: dados.accessToken,
        refreshToken: dados.refreshToken,
        usuario,
      };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  /**
   * Registra novo usuário
   */
  async cadastro(data) {
    try {
      const response = await api.post('/auth/cadastro', data);

      const dados = response.data.dados;

      const usuario = {
        id: dados.usuarioId,
        nome: dados.nome,
        email: dados.email,
        role: dados.role,
      };

      localStorage.setItem(
        'gastrocontrol:auth:token',
        dados.accessToken
      );

      localStorage.setItem(
        'gastrocontrol:auth:refreshToken',
        dados.refreshToken
      );

      localStorage.setItem(
        'gastrocontrol:auth:user',
        JSON.stringify(usuario)
      );

      return {
        accessToken: dados.accessToken,
        refreshToken: dados.refreshToken,
        usuario,
      };
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  },

  /**
   * Renova o token de acesso usando o refresh token
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('gastrocontrol:auth:refreshToken');
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await api.post('/auth/refresh', { refreshToken });
      const { accessToken } = response.data.dados;

      localStorage.setItem('gastrocontrol:auth:token', accessToken);
      return accessToken;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      // Clear auth data on refresh failure
      this.logout();
      throw error;
    }
  },

  /**
   * Faz logout do usuário
   */
  logout() {
    try {
      api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('gastrocontrol:auth:token');
      localStorage.removeItem('gastrocontrol:auth:refreshToken');
      localStorage.removeItem('gastrocontrol:auth:user');
    }
  },

  /**
   * Retorna o usuário autenticado
   */
  getCurrentUser() {
    const user = localStorage.getItem('gastrocontrol:auth:user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('gastrocontrol:auth:token');
  },

  /**
   * Retorna o token de acesso
   */
  getAccessToken() {
    return localStorage.getItem('gastrocontrol:auth:token');
  },
};

export default authService;
