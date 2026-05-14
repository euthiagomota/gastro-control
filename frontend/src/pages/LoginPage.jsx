import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
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
      description: 'Visão estratégica',
      credentials: { email: 'sara@boamesa.com.br', password: 'admin123' },
    },
    {
      id: 'funcionario',
      emoji: '👨‍🍳',
      title: 'Funcionário',
      description: 'Visão operacional',
      credentials: { email: 'joao@boamesa.com.br', password: 'func123' },
    },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id);
    setFormData({
      email: role.credentials.email,
      password: role.credentials.password,
      rememberMe: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = () => {
    if (selectedRole === 'admin') {
      navigate('/unidades');
    } else {
      navigate('/funcionario/inicio');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Back link */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-primary-100 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao início
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl mb-4 shadow-lg">
            <span className="text-xl font-extrabold text-primary-700">GC</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-1">GastroControl</h1>
          <p className="text-primary-200 text-sm">Gestão inteligente para restaurantes</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Bem-vindo de volta</h2>
              <p className="text-sm text-gray-500">Selecione seu perfil e entre na plataforma</p>
            </div>

            {/* Role Selection */}
            <div className="flex gap-3 mb-6">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
                    selectedRole === role.id
                      ? 'border-primary-700 bg-primary-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{role.emoji}</div>
                  <div className="font-semibold text-sm text-gray-900">{role.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{role.description}</div>
                </button>
              ))}
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
              className="space-y-4"
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Senha</label>
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent pr-11 transition-all placeholder:text-gray-400"
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
                className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow-md"
              >
                Entrar na plataforma
              </button>
            </form>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-500 mt-5">
              Não tem conta?{' '}
              <a href="#" className="text-primary-700 font-semibold hover:underline">
                Criar conta
              </a>
            </p>
          </div>

          {/* Demo hint */}
          <div className="bg-amber-50 border-t border-amber-200 px-6 py-3">
            <p className="text-xs text-amber-800">
              <strong>💡 Demo:</strong> Clique em um perfil para preencher automaticamente as credenciais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
