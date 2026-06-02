import { useEffect, useState } from 'react';
import { ChevronDown, Search, Plus, X } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { pratoService } from '../shared/services/pratoService';

export default function CardapioPage() {
  const [pratos, setPratos] = useState([]);
  const [filteredPratos, setFilteredPratos] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [showNewPratoModal, setShowNewPratoModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '', preco: '', tempo: '', categoria: '' });

  useEffect(() => {
    loadPratos();
  }, []);

  const loadPratos = async () => {
    try {
      setLoading(true);
      const data = await pratoService.listarPratos();
      setPratos(data || []);
      setFilteredPratos(data || []);
    } catch (err) {
      console.error('Erro ao carregar pratos:', err);
      setPratos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = pratos;

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter((prato) => prato.categoria === selectedCategory);
    }

    if (search.trim()) {
      filtered = filtered.filter(
        (prato) =>
          prato.nome.toLowerCase().includes(search.toLowerCase()) ||
          prato.descricao.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredPratos(filtered);
  }, [search, selectedCategory, pratos]);

  const categories = ['Todos', ...new Set(pratos.map((p) => p.categoria || 'Outros'))];

  const handleAddPrato = async (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) return;

    try {
      await pratoService.criarPrato({
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco || 0),
        tempoPreparacao: formData.tempo,
        categoria: formData.categoria || 'Outros',
      });

      loadPratos();
      setFormData({ nome: '', descricao: '', preco: '', tempo: '', categoria: '' });
      setShowNewPratoModal(false);
    } catch (err) {
      console.error('Erro ao criar prato:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Cardápio</h1>
        <p className="text-sm text-gray-500">Visualize e gerencie todos os pratos disponíveis</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar pratos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>
        <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={() => setShowNewPratoModal(true)}>
          <Plus size={16} />
          Novo prato
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <Card>
          <p className="text-center py-10 text-gray-500">Carregando cardápio...</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPratos.map((prato) => {
            const isExpanded = expandedId === prato.id;
            return (
              <Card key={prato.id} className="!p-0 overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : prato.id)}
                  className="w-full text-left p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-base font-bold text-gray-900">{prato.nome}</h3>
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {prato.categoria || 'Outros'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">{prato.descricao}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                        {prato.preco && <span className="font-semibold text-green-700">R$ {Number(prato.preco).toFixed(2)}</span>}
                        {prato.tempoPreparacao && <span>⏱️ {prato.tempoPreparacao}</span>}
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-gray-400 transition-transform flex-shrink-0 mt-0.5 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 sm:p-5 bg-gray-50">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Detalhes</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">{prato.descricao}</p>
                      {prato.ingredientes && prato.ingredientes.length > 0 && (
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Ingredientes:</p>
                          <ul className="list-disc list-inside text-gray-600">
                            {prato.ingredientes.map((ing, idx) => (
                              <li key={idx}>{ing}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {showNewPratoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 pointer-events-none flex items-center justify-center p-4 sm:p-6">
          <Card className="w-full max-w-md pointer-events-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Novo Prato</h2>
              <button onClick={() => setShowNewPratoModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPrato} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                  placeholder="Nome do prato"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                  placeholder="Descrição do prato"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Preço</label>
                  <input
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Tempo</label>
                  <input
                    type="text"
                    value={formData.tempo}
                    onChange={(e) => setFormData({ ...formData, tempo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                    placeholder="20 min"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Categoria</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.filter((c) => c !== 'Todos').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button variant="outline" className="flex-1" onClick={() => setShowNewPratoModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit" className="flex-1">
                  Criar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {filteredPratos.length === 0 && !loading && (
        <Card className="text-center py-10">
          <p className="text-gray-500">Nenhum prato encontrado</p>
        </Card>
      )}
    </div>
  );
}
