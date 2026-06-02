import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { authService } from '../../../shared/services/authService';

export default function CadastroPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmSenha: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validações
      if (!formData.nome.trim()) {
        setError('Nome é obrigatório');
        setLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        setError('Email é obrigatório');
        setLoading(false);
        return;
      }

      if (formData.senha.length < 6) {
        setError('Senha deve ter no mínimo 6 caracteres');
        setLoading(false);
        return;
      }

      if (formData.senha !== formData.confirmSenha) {
        setError('As senhas não correspondem');
        setLoading(false);
        return;
      }

      // Chamar backend
      const { usuario } = await authService.cadastro({
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha,
      });

      setSuccess(true);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        if (usuario.role === 'ADMIN') {
          navigate('/unidades');
        } else if (usuario.role === 'OPERADOR') {
          navigate('/funcionario/inicio');
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (err) {
      console.error('Erro ao registrar:', err);
      const mensagemErro =
        err.response?.data?.mensagem ||
        err.message ||
        'Erro ao criar conta. Tente novamente.';
      setError(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F4F5F3] flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Conta criada com sucesso!</h1>
              <p className="text-gray-600 mb-6">Você será redirecionado em breve...</p>
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F3] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl mb-4">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao login
        </button>
      </div>

      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-primary-700 text-white flex items-center justify-center font-extrabold text-sm">
                GC
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">GastroControl</h1>
            </div>

            <div className="mb-6">
              <h2 className="text-3xl sm:text-[42px] leading-[1.1] tracking-tight font-extrabold text-gray-900 mb-2">
                Criar conta
              </h2>
              <p className="text-sm sm:text-base text-gray-500">Preencha os dados abaixo para se registrar</p>
            </div>

            <form onSubmit={handleCadastro} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3.5">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">Nome completo</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">E-mail</label>
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
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="senha"
                    value={formData.senha}
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

              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">Confirmar senha</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmSenha"
                    value={formData.confirmSenha}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent pr-11 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 text-base shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Já tem conta?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary-700 font-semibold hover:underline"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
