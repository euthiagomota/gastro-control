import { useMemo, useState } from 'react';
import { Plus, Clock3, Star, Search, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/ui/Button';
import Card from '../../../shared/ui/Card';
import useOperationalFlow from '../../../shared/context/useOperationalFlow';

export default function CardapioPage() {
  const navigate = useNavigate();
  const { pratos, addPrato } = useOperationalFlow();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [newPrato, setNewPrato] = useState({
    nome: '',
    categoria: 'Pratos',
    descricao: '',
  });

  const categories = useMemo(() => {
    const categorySet = new Set(pratos.map((item) => item.categoria).filter(Boolean));
    return ['Todos', ...Array.from(categorySet)];
  }, [pratos]);

  const filtered = useMemo(() => {
    return pratos.filter((item) => {
      const matchesCategory = activeCategory === 'Todos' || item.categoria === activeCategory;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term
        || item.nome.toLowerCase().includes(term)
        || item.descricao.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [pratos, activeCategory, searchTerm]);

  const handleCreatePrato = (event) => {
    event.preventDefault();

    const normalizedName = newPrato.nome.trim();
    if (!normalizedName) {
      setFeedback({ type: 'error', message: 'Informe o nome do prato.' });
      return;
    }

    const alreadyExists = pratos.some((item) => item.nome.toLowerCase() === normalizedName.toLowerCase());
    if (alreadyExists) {
      setFeedback({ type: 'error', message: 'Este prato ja existe no cardapio.' });
      return;
    }

    addPrato({
      nome: normalizedName,
      categoria: newPrato.categoria,
      descricao: newPrato.descricao.trim() || `Descricao de ${normalizedName}`,
    });

    setFeedback({ type: 'success', message: `Prato "${normalizedName}" criado e pronto para receber ficha tecnica.` });
    setNewPrato({ nome: '', categoria: 'Pratos', descricao: '' });
    setIsNewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Cardápio</h1>
          <p className="text-sm text-gray-500 mt-1">{pratos.length} pratos cadastrados</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" className="flex items-center gap-1.5 w-full sm:w-auto" onClick={() => setIsNewModalOpen(true)}>
            <Plus size={15} />
            Novo prato
          </Button>
          <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => navigate('/admin/fichas-tecnicas')}>
            Próxima etapa: Ficha Técnica →
          </Button>
        </div>
      </div>

      {feedback && (
        <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${
          feedback.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <p className="font-medium">{feedback.message}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200 px-4 py-2.5 w-full md:w-auto md:min-w-52">
          <Search size={16} className="text-gray-400" />
          <input
            className="bg-transparent outline-none text-sm w-full"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium border transition-colors whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-primary-700 border-primary-700 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {filtered.map((item) => (
          <Card key={item.id} className="!p-0 rounded-3xl overflow-hidden">
            <div className="relative h-40 sm:h-44">
              <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-white/90 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">{item.categoria}</span>
              <span className="absolute top-3 right-3 bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-semibold">ativo</span>
            </div>

            <div className="p-4">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 mb-1">{item.nome}</h3>
              <p className="text-gray-500 mb-3">{item.descricao}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="inline-flex items-center gap-1"><Clock3 size={14} /> {item.tempo}</span>
                <span className="inline-flex items-center gap-1 text-amber-500"><Star size={14} fill="currentColor" /> {item.rating}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-2xl p-3 text-center">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Venda</p>
                  <p className="font-bold text-gray-900">{item.venda}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Custo</p>
                  <p className="font-bold text-gray-900">{item.custo}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400">Margem</p>
                  <p className="font-bold text-green-700">{item.margem}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="rounded-3xl !p-6 text-center border border-dashed border-gray-300 bg-gray-50">
          <p className="text-sm font-semibold text-gray-800">Nenhum prato encontrado</p>
          <p className="text-xs text-gray-500 mt-1">Ajuste os filtros ou adicione um novo prato.</p>
        </Card>
      )}

      {isNewModalOpen && (
        <div className="fixed inset-0 z-[110]">
          <div className="absolute inset-0 bg-slate-900/45" onClick={() => setIsNewModalOpen(false)} />
          <div className="relative h-full w-full flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl bg-white border border-gray-200 shadow-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-xl font-bold text-gray-900">Novo prato</h3>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleCreatePrato}>
                <div>
                  <label htmlFor="new-dish-name" className="block text-sm font-semibold text-gray-700 mb-1.5">Nome do prato</label>
                  <input
                    id="new-dish-name"
                    type="text"
                    value={newPrato.nome}
                    onChange={(event) => setNewPrato((previous) => ({ ...previous, nome: event.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    placeholder="Ex.: Lasanha caseira"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="new-dish-category" className="block text-sm font-semibold text-gray-700 mb-1.5">Categoria</label>
                  <select
                    id="new-dish-category"
                    value={newPrato.categoria}
                    onChange={(event) => setNewPrato((previous) => ({ ...previous, categoria: event.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="Marmitas">Marmitas</option>
                    <option value="Lanches">Lanches</option>
                    <option value="Pratos">Pratos</option>
                    <option value="Massas">Massas</option>
                    <option value="Sobremesas">Sobremesas</option>
                    <option value="Combos">Combos</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="new-dish-description" className="block text-sm font-semibold text-gray-700 mb-1.5">Descricao</label>
                  <textarea
                    id="new-dish-description"
                    rows={3}
                    value={newPrato.descricao}
                    onChange={(event) => setNewPrato((previous) => ({ ...previous, descricao: event.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-none"
                    placeholder="Descreva rapidamente os principais componentes do prato"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setIsNewModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="w-full">
                    Salvar prato
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
