import { useState } from 'react';
import { Search, Plus, Download, Bell } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';

export default function AdminEstoque() {
  const [searchTerm, setSearchTerm] = useState('');

  const metrics = [
    { label: 'Total de itens', value: 8, icon: '📦', bg: 'bg-blue-50', border: 'border-blue-200', color: 'text-blue-700' },
    { label: 'Itens críticos', value: 2, icon: '🔴', bg: 'bg-red-50', border: 'border-red-200', color: 'text-red-700' },
    { label: 'Vencendo em breve', value: 1, icon: '⏰', bg: 'bg-amber-50', border: 'border-amber-200', color: 'text-amber-700' },
    { label: 'Valor total', value: 'R$ 356', icon: '💰', bg: 'bg-green-50', border: 'border-green-200', color: 'text-green-700' },
  ];

  const estoqueData = [
    { id: 1, ingrediente: 'Frango', status: 'Crítico', quantidade: '2.5 kg', minimo: '5 kg', validade: '08/05/2026', statusColor: 'bg-red-100 text-red-700' },
    { id: 2, ingrediente: 'Arroz', status: 'Baixo', quantidade: '8 kg', minimo: '10 kg', validade: '15/08/2026', statusColor: 'bg-amber-100 text-amber-700' },
    { id: 3, ingrediente: 'Queijo Mussarela', status: 'Vencendo', quantidade: '1.2 kg', minimo: '3 kg', validade: '10/05/2026', statusColor: 'bg-orange-100 text-orange-700' },
    { id: 4, ingrediente: 'Alface', status: 'Normal', quantidade: '15 un', minimo: '5 un', validade: '07/05/2026', statusColor: 'bg-green-100 text-green-700' },
    { id: 5, ingrediente: 'Tomate', status: 'Normal', quantidade: '4 kg', minimo: '2 kg', validade: '09/05/2026', statusColor: 'bg-green-100 text-green-700' },
    { id: 6, ingrediente: 'Feijão Carioca', status: 'Normal', quantidade: '12 kg', minimo: '5 kg', validade: '20/10/2026', statusColor: 'bg-green-100 text-green-700' },
    { id: 7, ingrediente: 'Azeite Extra Virgem', status: 'Crítico', quantidade: '0.8 L', minimo: '2 L', validade: '01/01/2027', statusColor: 'bg-red-100 text-red-700' },
    { id: 8, ingrediente: 'Macarrão Penne', status: 'Normal', quantidade: '5 kg', minimo: '3 kg', validade: '01/12/2026', statusColor: 'bg-green-100 text-green-700' },
  ];

  const columns = [
    { key: 'ingrediente', label: 'Ingrediente' },
    {
      key: 'status',
      label: 'Status',
      render: (value, row) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}>
          {value}
        </span>
      ),
    },
    { key: 'quantidade', label: 'Quantidade', render: (value) => <span className="font-semibold">{value}</span> },
    { key: 'minimo', label: 'Mínimo', render: (value) => <span className="text-gray-500">{value}</span> },
    { key: 'validade', label: 'Validade', render: (value) => <span className="text-gray-500">{value}</span> },
  ];

  const filteredData = estoqueData.filter((item) =>
    item.ingrediente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Estoque</h1>
          <p className="text-sm text-gray-500 mt-1">Controle de ingredientes e insumos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">📤 Saída</Button>
          <Button variant="outline" size="sm">📥 Entrada</Button>
          <Button variant="primary" size="sm" className="flex items-center gap-1.5">
            <Plus size={15} />
            Adicionar item
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className={`border ${metric.border} ${metric.bg} !p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{metric.icon}</span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${metric.color} mb-0.5`}>{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.label}</p>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
        <Search size={18} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar ingrediente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table columns={columns} data={filteredData} />
        </div>
        {filteredData.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Package size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum item encontrado</p>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Download size={15} />
          Gerar relatório
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Bell size={15} />
          Alertar fornecedores
        </Button>
      </div>
    </div>
  );
}
