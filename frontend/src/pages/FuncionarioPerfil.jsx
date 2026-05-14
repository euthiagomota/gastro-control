import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { LogOut, Mail, MapPin, Briefcase, Clock, Edit2, Lock, Bell, ChevronRight } from 'lucide-react';

export default function FuncionarioPerfil() {
  const navigate = useNavigate();

  const funcionario = {
    nome: 'João Silva',
    cargo: 'Cozinheiro',
    avatar: 'JS',
    unidade: 'Restaurante Boa Mesa',
    permissao: 'Cozinha',
    horario: 'Segunda a Sexta: 08:00 — 17:00',
  };

  const infoItems = [
    { icon: Mail, label: 'Nome', value: funcionario.nome },
    { icon: MapPin, label: 'Unidade', value: funcionario.unidade },
    { icon: Briefcase, label: 'Permissão', value: funcionario.permissao },
    { icon: Clock, label: 'Horário', value: funcionario.horario },
  ];

  const stats = [
    { label: 'Tarefas completas', value: '127', bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-700' },
    { label: 'Taxa de conclusão', value: '98%', bg: 'bg-green-50', border: 'border-green-200', color: 'text-green-700' },
    { label: 'Dias consecutivos', value: '24', bg: 'bg-purple-50', border: 'border-purple-200', color: 'text-purple-700' },
    { label: 'Avaliação média', value: '4.8', bg: 'bg-amber-50', border: 'border-amber-200', color: 'text-amber-700' },
  ];

  const quickLinks = [
    { label: 'Editar informações', desc: 'Atualize seu perfil', icon: Edit2 },
    { label: 'Alterar senha', desc: 'Atualize sua senha de acesso', icon: Lock },
    { label: 'Notificações', desc: 'Configure seus alertas', icon: Bell },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Meu Perfil</h1>

      {/* Profile card */}
      <Card className="text-center">
        <div className="flex flex-col items-center py-2">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-3 shadow-lg">
            {funcionario.avatar}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-0.5">{funcionario.nome}</h2>
          <p className="text-sm text-gray-500 mb-3">{funcionario.cargo}</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-full text-xs font-semibold text-primary-700">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Ativo · {funcionario.unidade}
          </span>
        </div>
      </Card>

      {/* Info */}
      <Card>
        <h3 className="text-base font-bold text-gray-900 mb-4">Informações</h3>
        <div className="space-y-2">
          {infoItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Stats */}
      <Card>
        <h3 className="text-base font-bold text-gray-900 mb-4">Estatísticas</h3>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl border ${stat.bg} ${stat.border} text-center`}>
              <div className={`text-2xl font-bold ${stat.color} mb-0.5`}>{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick links */}
      <Card>
        <h3 className="text-base font-bold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="space-y-2">
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <button key={i} className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group">
                <div className="w-9 h-9 bg-gray-100 group-hover:bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <Icon size={18} className="text-gray-500 group-hover:text-primary-700 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{link.label}</p>
                  <p className="text-xs text-gray-500">{link.desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-primary-700 flex-shrink-0 transition-colors" />
              </button>
            );
          })}
        </div>
      </Card>

      {/* Logout */}
      <button
        onClick={() => navigate('/login')}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm transition-colors"
      >
        <LogOut size={18} />
        Sair da conta
      </button>

      {/* Help */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">❓</span>
          <div>
            <h3 className="text-sm font-bold text-blue-900 mb-1">Precisa de ajuda?</h3>
            <p className="text-xs text-blue-700 mb-2 leading-relaxed">
              Entre em contato com seu supervisor ou gestor para qualquer dúvida.
            </p>
            <button className="text-xs text-blue-700 font-semibold hover:underline">Contatar suporte →</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
