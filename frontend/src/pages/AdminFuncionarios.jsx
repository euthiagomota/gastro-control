import { useState } from 'react';
import { Plus, Edit2, Trash2, Download, Send } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';

export default function AdminFuncionarios() {
  const funcionariosData = [
    { id: 1, nome: 'João Silva', cargo: 'Cozinheiro', permissao: 'Cozinha', ultimoAcesso: 'Hoje, 08:42', status: 'ativo', initials: 'JS' },
    { id: 2, nome: 'Ana Lima', cargo: 'Gerente de Turno', permissao: 'Gerente', ultimoAcesso: 'Hoje, 07:30', status: 'ativo', initials: 'AL' },
    { id: 3, nome: 'Carlos Mendes', cargo: 'Auxiliar de Estoque', permissao: 'Estoque', ultimoAcesso: 'Ontem, 18:15', status: 'ativo', initials: 'CM' },
    { id: 4, nome: 'Fernanda Costa', cargo: 'Atendente', permissao: 'Atendimento', ultimoAcesso: 'Hoje, 09:00', status: 'ativo', initials: 'FC' },
    { id: 5, nome: 'Ricardo Borges', cargo: 'Auxiliar de Cozinha', permissao: 'Cozinha', ultimoAcesso: '12/04/2026', status: 'inativo', initials: 'RB' },
  ];

  const metrics = [
    { label: 'Total', value: 5, icon: '👥', bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-700' },
    { label: 'Ativos', value: 4, icon: '✅', bg: 'bg-green-50', border: 'border-green-200', color: 'text-green-700' },
    { label: 'Inativos', value: 1, icon: '🔒', bg: 'bg-gray-50', border: 'border-gray-200', color: 'text-gray-700' },
  ];

  const columns = [
    {
      key: 'nome',
      label: 'Funcionário',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-700 text-white rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">
            {row.initials}
          </div>
          <span className="font-semibold text-gray-900">{value}</span>
        </div>
      ),
    },
    { key: 'cargo', label: 'Cargo' },
    {
      key: 'permissao',
      label: 'Permissão',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
          {value}
        </span>
      ),
    },
    {
      key: 'ultimoAcesso',
      label: 'Último acesso',
      render: (value) => <span className="text-gray-500">{value}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
          value === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${value === 'ativo' ? 'bg-green-500' : 'bg-gray-400'}`} />
          {value === 'ativo' ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Ações',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit2 size={15} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Funcionários</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie a equipe e permissões</p>
        </div>
        <Button variant="primary" size="sm" className="flex items-center gap-1.5 self-start sm:self-auto">
          <Plus size={15} />
          Adicionar funcionário
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className={`border ${metric.border} ${metric.bg} !p-4`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{metric.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${metric.color} mb-0.5`}>{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.label}</p>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table columns={columns} data={funcionariosData} />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Download size={15} />
          Relatório de presença
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Send size={15} />
          Enviar aviso
        </Button>
      </div>
    </div>
  );
}
