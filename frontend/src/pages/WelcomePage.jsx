import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, AlertCircle, AlertTriangle, Info, BarChart3, Shield, Trash2, FileText, ChevronRight } from 'lucide-react';

function FeatureItem({ icon: Icon, title }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={20} className="text-primary-700" />
      </div>
      <p className="text-sm sm:text-base font-medium text-gray-700 leading-snug pt-1">{title}</p>
    </div>
  );
}

function AlertBadge({ type, message }) {
  const styles = {
    error: { bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500', text: 'text-red-700' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', text: 'text-amber-700' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', text: 'text-blue-700' },
  };
  const s = styles[type] || styles.info;
  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-lg border ${s.bg} ${s.border}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0 mt-1`} />
      <p className={`text-xs font-medium ${s.text} leading-snug`}>{message}</p>
    </div>
  );
}

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">GC</span>
            </div>
            <span className="text-base font-bold text-gray-900">GastroControl</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Recursos</a>
            <a href="#about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sobre</a>
          </nav>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-1.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Entrar
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left Column */}
            <div className="space-y-8 order-2 lg:order-1">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 bg-primary-600 rounded-full" />
                <span className="text-xs font-semibold text-primary-700">SaaS para Restaurantes</span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
                  Produção inteligente,{' '}
                  <span className="text-primary-700">estoque no controle.</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl">
                  Do pedido à produção, do estoque à entrega. O GastroControl transforma dados em decisões e demanda em ação — para restaurantes, dark kitchens e food trucks.
                </p>
              </div>

              {/* Features */}
              <div id="features" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureItem icon={BarChart3} title="Dashboards em tempo real" />
                <FeatureItem icon={Shield} title="Controle de estoque inteligente" />
                <FeatureItem icon={Trash2} title="Redução de desperdício" />
                <FeatureItem icon={FileText} title="Fichas técnicas automatizadas" />
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Entrar na plataforma
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  Criar conta grátis
                </button>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2">
                  {['SA', 'JM', 'RC', 'AM', 'PB'].map((init, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-xs">★</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">+500 restaurantes usando</p>
                </div>
              </div>
            </div>

            {/* Right Column - Dashboard Preview */}
            <div className="relative order-1 lg:order-2">
              {/* Main image container */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] max-h-[600px]">
                <img
                  src="https://images.unsplash.com/photo-1504674900967-a694f45acb82?w=800&h=900&fit=crop"
                  alt="Restaurante em operação"
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent" />

                {/* Floating metric card - top right */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 w-44 sm:w-52">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Desperdício evitado</p>
                  <p className="text-2xl font-bold text-gray-900">R$ 2.100</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="text-xs font-semibold text-green-600">+12% este mês</span>
                  </div>
                </div>

                {/* Floating alerts card - bottom */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4">
                  <h3 className="text-xs font-bold text-gray-900 mb-2.5">Alertas do dia</h3>
                  <div className="space-y-2">
                    <AlertBadge type="error" message="Estoque baixo: frango, arroz, queijo" />
                    <AlertBadge type="warning" message="42 marmitas fitness para produzir" />
                    <AlertBadge type="info" message="5 pedidos aguardando preparo" />
                  </div>
                </div>
              </div>

              {/* Decoration blobs */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-60 -z-10" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary-50 rounded-full blur-3xl opacity-80 -z-10" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
