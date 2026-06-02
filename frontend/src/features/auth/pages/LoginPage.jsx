import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authService } from '../../../shared/services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: 'sara@boamesa.com.br',
    password: 'admin123',
    rememberMe: false,
  });

  const roles = [
    {
      id: 'admin',
      emoji: '👑',
      title: 'Admin',
      subtitle: 'Visão estratégica',
      credentials: { email: 'sara@boamesa.com.br', password: 'admin123' },
    },
    {
      id: 'funcionario',
      emoji: '👨‍🍳',
      title: 'Funcionário',
      subtitle: 'Visão operacional',
      credentials: { email: 'joao@boamesa.com.br', password: 'func123' },
    },
  ];

  const handleRoleChange = (role) => {
    setSelectedRole(role.id);
    setFormData((prev) => ({
      ...prev,
      email: role.credentials.email,
      password: role.credentials.password,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Tentar login direto sem validação restritiva
      const { usuario } = await authService.login(formData.email, formData.password);
      
      // Redirecionar baseado no role do usuário
      if (usuario.role === 'ADMIN') {
        navigate('/unidades');
      } else if (usuario.role === 'OPERADOR') {
        navigate('/funcionario/inicio');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      const mensagemErro = err.response?.data?.mensagem || err.message || 'Email ou senha inválidos. Tente novamente.';
      setError(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F3] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
      </div>

      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-primary-700 text-white flex items-center justify-center font-extrabold text-sm">GC</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">GastroControl</h1>
            </div>

            <div className="mb-6">
              <h2 className="text-3xl sm:text-[42px] leading-[1.1] tracking-tight font-extrabold text-gray-900 mb-2">Bem-vindo de volta</h2>
              <p className="text-sm sm:text-base text-gray-500">Selecione seu perfil e entre na plataforma</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {roles.map((role) => {
                const active = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`rounded-2xl border p-4 text-center transition-all ${
                      active
                        ? 'border-primary-600 bg-primary-50 shadow-sm ring-1 ring-primary-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-xl mb-1">{role.emoji}</p>
                    <p className="text-[15px] font-semibold text-gray-900">{role.title}</p>
                    <p className="text-xs text-gray-500">{role.subtitle}</p>
                  </button>
                );
              })}
            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-4"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3.5">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <div>
                <label className="block text-base sm:text-xl font-semibold text-gray-700 mb-2">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <label className="text-base sm:text-xl font-semibold text-gray-700">Senha</label>
                  <a href="#" className="text-xs text-primary-700 hover:underline font-medium">
                    Esqueci a senha
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent pr-11 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-700"
                />
                <span className="text-sm text-gray-600">Lembrar de mim</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 text-base shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Não tem conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/cadastro')}
                className="text-primary-700 font-semibold hover:underline"
              >
                Criar conta
              </button>
            </p>
          </div>

          <div className="bg-amber-50 border-t border-amber-200 px-6 py-3">
            <p className="text-xs text-amber-800">
              <strong>💡 Demo:</strong> Clique em um perfil para preencher automaticamente as credenciais de demonstração.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
