import { useState, useEffect } from 'react';
import { Search, Plus, Download, Bell, Package } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Table from '../components/Table';
import { estoqueService } from '../shared/services/estoqueService';

export default function AdminEstoque() {
  const [searchTerm, setSearchTerm] = useState('');
  const [estoque, setEstoque] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEstoque();
    loadAlertas();
  }, []);

  const loadEstoque = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await estoqueService.listEstoque();
      setEstoque(data || []);
    } catch (err) {
      console.error('Erro ao carregar estoque:', err);
      setError('Erro ao carregar estoque.');
      setEstoque([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAlertas = async () => {
    try {
      const alertasBaixo = await estoqueService.getAlertasEstoqueBaixo();
      setAlertas(alertasBaixo || []);
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Crítico') return 'bg-red-100 text-red-700';
    if (status === 'Baixo') return 'bg-amber-100 text-amber-700';
    if (status === 'Vencendo') return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  };

  const estoqueData = estoque.map((item) => ({
    id: item.id,
    ingrediente: item.ingrediente?.nome || 'N/A',
    status: item.status || 'Normal',
    quantidade: `${item.quantidade} ${item.unidade}`,
    minimo: item.minimo || 'N/A',
    validade: item.validadeFormatada || 'N/A',
    statusColor: getStatusColor(item.status),
  }));

  const metrics = [
    {
      label: 'Total de itens',
      value: estoque.length,
      icon: '📦',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      color: 'text-blue-700',
    },
    {
      label: 'Itens críticos',
      value: estoque.filter((e) => e.status === 'Crítico').length,
      icon: '🔴',
      bg: 'bg-red-50',
      border: 'border-red-200',
      color: 'text-red-700',
    },
    {
      label: 'Vencendo em breve',
      value: alertas.length,
      icon: '⏰',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      color: 'text-amber-700',
    },
    {
      label: 'Valor total',
      value: `R$ ${(estoque.reduce((sum, e) => sum + (e.valorTotal || 0), 0) / 100).toFixed(0)}`,
      icon: '💰',
      bg: 'bg-green-50',
      border: 'border-green-200',
      color: 'text-green-700',
    },
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

      <Card>
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Carregando estoque...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table columns={columns} data={filteredData} />
            </div>
            {filteredData.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Package size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhum item encontrado</p>
              </div>
            )}
          </>
        )}
      </Card>

      {alertas.length > 0 && (
        <Card className="border-l-4 border-l-amber-500">
          <h3 className="text-sm font-bold text-gray-900 mb-3">⚠️ Alertas de vencimento</h3>
          <div className="space-y-2">
            {alertas.slice(0, 3).map((alerta, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg">
                <span className="text-xs mt-0.5">📅</span>
                <span className="text-xs text-amber-700">{alerta.ingrediente} vence em {alerta.dias} dias</span>
              </div>
            ))}
          </div>
        </Card>
      )}

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
